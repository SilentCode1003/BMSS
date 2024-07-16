var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { Logger } = require('./repository/logger')
const { convert } = require('./repository/customhelper')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'production')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `
          SELECT p_productionid as productionid, p_productid as productid, mp_description as productname, p_startdate as startdate, p_enddate as enddate, 
              p_quantityproduced as quantityproduced, p_productionline as productionline, me_fullname as supervisorid, p_notes as notes, p_status as status
          FROM production
          INNER JOIN master_product ON mp_productid = p_productid
          INNER JOIN master_employees ON me_employeeid = p_supervisorid
          ORDER BY p_productionid DESC`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }

      console.log(helper.GetCurrentDatetime())

      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.get('/laodpending', (req, res) => {
  try {
    let sql = `select * from production where p_status = "PENDING"`

    mysql.Select(sql, 'Production', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      console.log(helper.GetCurrentDatetime())

      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/save', (req, res) => {
  try {
    let productid = req.body.productid
    let startdate = req.body.startdate
    let enddate = req.body.enddate
    let quantityproduced = req.body.quantityproduced
    let productionline = req.body.productionline
    let employeeid = req.body.employeeid
    let notes = req.body.notes
    let status = dictionary.GetValue(dictionary.PND())
    let data = []

    let sql_check = `select * from production where p_productid='${productid}'`

    mysql.Select(sql_check, 'Production', (err, result) => {
      if (err) console.error('Error: ', err)

      data.push([
        productid,
        startdate,
        enddate,
        quantityproduced,
        productionline,
        employeeid,
        notes,
        status,
      ])

      mysql.InsertTable('production', data, (err, result) => {
        if (err) console.error('Error: ', err)

        console.log(result)

        res.json({
          msg: 'success',
        })
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/approve', async (req, res) => {
  try {
    const { productionid, productid } = req.body
    const productionQuantity = req.body.quantity
    let queries = []

    if (!productionid || !productid || !productionQuantity) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const existing = await Check('SELECT * FROM production WHERE p_productionid = ?', [
      productionid,
    ])
    if (!existing) {
      return res.json({
        msg: 'Production does not exist',
      })
    }

    const status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.INP())
        : dictionary.GetValue(dictionary.PND())

    const selectComponent =
      'SELECT pc_components as components FROM product_component WHERE pc_productid = ?'
    const response = await Query(selectComponent, [productid])
    const components = JSON.parse(response[0].components)

    const updatedData = components.map((item) => {
      const { quantity, unit, unitdeduction, materialid } = item

      const ratio = convert(unit, unitdeduction)
      const convertedQuantity = parseFloat(quantity) * ratio
      const updatedQuantity = convertedQuantity * productionQuantity

      return {
        materialId: materialid,
        quantity: parseFloat(updatedQuantity),
        unitDeduction: unitdeduction,
        baseUnit: unit,
        baseQuantity: quantity * productionQuantity,
      }
    })

    updateInventory = async (data) => {
      for (const item of data) {
        const { materialId, quantity, unitDeduction, baseUnit, baseQuantity } = item

        const getQuantity = await Query(
          'SELECT pmc_quantity as currentQuantity, pmc_countid as countId FROM production_material_count WHERE pmc_productid = ?',
          [materialId]
        )

        if (getQuantity.length === 0) {
          return res.json({
            msg: 'material not found',
          })
        }

        const { currentQuantity, countId } = getQuantity[0]

        if (quantity <= currentQuantity) {
          const totalQuantity = parseFloat(currentQuantity) - parseFloat(quantity)

          console.log(
            `materialId: ${materialId} quantity: ${quantity} currentQuantity: ${currentQuantity} totalQuantity: ${totalQuantity}`
          )

          queries.push({
            sql: 'UPDATE production_material_count SET pmc_quantity = ? WHERE pmc_productid = ?',
            values: [totalQuantity, materialId],
          })

          queries.push({
            sql: 'INSERT INTO production_material_history (pmh_countId, pmh_baseQuantity, pmh_movementUnit, pmh_baseUnit, pmh_convertedQuantity, pmh_movementId, pmh_type, pmh_date, pmh_stocksBefore, pmh_stocksAfter, pmh_unitBefore, pmh_unitAfter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values: [
              countId,
              baseQuantity,
              unitDeduction,
              baseUnit,
              quantity,
              productionid,
              'PRODUCTION',
              helper.GetCurrentDatetime(),
              currentQuantity,
              totalQuantity,
              baseUnit,
              baseUnit,
            ],
          })
        } else {
          return res.json({ msg: 'insufficient' })
        }
      }

      queries.push({
        sql: 'UPDATE production SET p_status = ? WHERE p_productionid = ?',
        values: [status, productionid],
      })

      await Transaction(queries)

      res.json({
        msg: 'success',
      })
    }

    updateInventory(updatedData)
  } catch (error) {
    return res.json({ msg: error.message })
  }
})

router.post('/recordinventory', (req, res) => {
  try {
    let productionid = req.body.productionid
    let productid = req.body.productid
    let quantity = req.body.quantity
    let updatedquantity = 0
    let status = dictionary.GetValue(dictionary.CMP())
    let data = []
    const statusdata = [status, productionid]

    console.log(
      'Quantity: ' + quantity + ' Product id: ' + productid + ' Production ID: ' + productionid
    )
    let sql_check = `select * from production_inventory where pi_productid='${productid}'`

    function updatestatus(updatedata) {
      const sql_Update_status = `UPDATE production SET p_status = ? WHERE p_productionid = ?`
      mysql.UpdateMultiple(sql_Update_status, updatedata, (err, result) => {
        if (err) {
          console.error('Error: ', err)
        }

        let rowData = [productionid, quantity]

        mysql.InsertTable('production_history', [rowData], (err, result) => {
          if (err) console.error('Error: ', err)
          console.log('Data successfully inserted: ' + result)
        })
        res.json({
          msg: 'success',
        })
      })
    }

    mysql.Select(sql_check, 'ProductionInventory', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        let sql_checkquantity = `select pi_quantity as quantity from production_inventory where pi_productid='${productid}'`
        mysql.SelectResult(sql_checkquantity, (err, result) => {
          if (err) {
            console.log('Error: ' + err)
          }
          let resultquantity = result[0].quantity
          console.log('Current Quantity: ' + resultquantity)
          updatedquantity = parseFloat(resultquantity) + parseFloat(quantity)

          const sql_Update = `UPDATE production_inventory SET pi_quantity = ? WHERE pi_productid = '${productid}'`
          mysql.UpdateMultiple(sql_Update, [updatedquantity], (err, result) => {
            if (err) {
              console.error('Error: ', err)
            }
            updatestatus(statusdata)
          })
        })
      } else {
        data.push([productid, quantity])

        mysql.InsertTable('production_inventory', data, (err, result) => {
          if (err) console.error('Error: ', err)

          console.log(result)
          updatestatus(statusdata)
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/status/complete', (req, res) => {
  try {
    let productionid = req.body.productionid
    const quantity = req.body.quantity
    let status = dictionary.GetValue(dictionary.CMP())
    let data = [status, productionid]
    let rowData = [productionid, quantity]

    mysql.InsertTable('production_history', [rowData], (err, result) => {
      if (err) console.error('Error: ', err)
      console.log('Production History Recorded: ' + result)
    })

    const sql_Update = `UPDATE production SET p_status = ? WHERE p_productionid = ?`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      let loglevel = dictionary.INF()
      let source = dictionary.PRD()
      let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`
      let user = req.session.employeeid

      Logger(loglevel, source, message, user)

      res.json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/cancel', (req, res) => {
  try {
    let productionid = req.body.productionid
    let status = dictionary.GetValue(dictionary.CND())
    let data = [status, productionid]
    console.log(data)

    const sql_Update = `UPDATE production 
                          SET p_status = ?
                          WHERE p_productionid = ?`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      let loglevel = dictionary.INF()
      let source = dictionary.PRD()
      let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`
      let user = req.session.employeeid

      Logger(loglevel, source, message, user)

      res.json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
