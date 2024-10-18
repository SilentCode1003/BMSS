var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { convert } = require('./repository/customhelper')
const { DataModeling } = require('./model/bmssmodel')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'materialcount')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `select pmc_countid as countid, pmc_productid as productid, pmc_quantity as quantity, pmc_unit as unit, pmc_status as status, pmc_createdby as createdby,
 pmc_createddate as createddate, pmc_updateddate as updateddate, mpm_productname as productname
 from production_material_count
    INNER JOIN production_materials ON pmc_productid = mpm_productid`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

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

router.get('/load/:id', (req, res) => {
  try {
    const id = req.params.id
    let sql = `SELECT mpm_productname AS productname, mpm_description AS description, mv_vendorname AS vendorid, pmc_quantity as stocks, pmc_unit as unit
      FROM production_materials
      INNER JOIN master_vendor ON mv_vendorid = mpm_vendorid
      INNER JOIN master_category ON mc_categorycode = mpm_category
      INNER JOIN production_material_count ON pmc_countid = mpm_productid
      WHERE mpm_productid = ${id};`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }

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

router.post('/save', async (req, res) => {
  try {
    const materialData = JSON.parse(req.body.materialdata)
    const status = req.body.status
    const orderid = req.body.orderid
    let queries = []

    if (materialData.length === 0) {
      return res.json({
        msg: 'no data',
      })
    }

    const processMaterialData = async () => {
      let orderstatus = 'NOT COMPLETE'
      for (const row of materialData) {
        const { productid, quantity, unitDeduction } = row

        const response = await Query(
          'SELECT * FROM production_material_count WHERE pmc_productid = ?',
          [productid],
          'pmc_'
        )

        if (response.length === 0) {
          res.status(400).json({
            msg: 'Invalid Material ID',
          })
        }

        if (quantity <= 0 || quantity == undefined) {
          continue
        } else {
          const oldUnit = response[0].unit
          const existingQuantity = response[0].quantity
          const countId = response[0].countid

          const ratio = convert(oldUnit, unitDeduction)
          const convertedQuantity = quantity * ratio

          const totalQuantity = parseFloat(existingQuantity) + parseFloat(convertedQuantity)

          queries.push({
            sql: 'UPDATE production_material_count SET pmc_quantity = ?, pmc_updateddate = ? WHERE pmc_productid = ?',
            values: [totalQuantity, helper.GetCurrentDatetime(), productid],
          })

          queries.push({
            sql: 'INSERT INTO production_material_history (pmh_countId, pmh_baseQuantity, pmh_movementUnit, pmh_baseUnit, pmh_convertedQuantity, pmh_movementId, pmh_type, pmh_date, pmh_stocksBefore, pmh_stocksAfter, pmh_unitBefore, pmh_unitAfter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values: [
              countId,
              quantity,
              unitDeduction ? unitDeduction : oldUnit,
              oldUnit,
              convertedQuantity,
              orderid,
              status,
              helper.GetCurrentDatetime(),
              existingQuantity,
              totalQuantity,
              oldUnit,
              oldUnit,
            ],
          })
        }
      }

      //console.log(queries)
      const transac = await Transaction(queries)

      //console.log(orderstatus)

      if (transac) {
        res.json({
          msg: 'success',
          data: orderstatus,
        })
      } else {
        res.status(400).json({
          msg: 'error',
        })
      }
    }

    processMaterialData()

    // const totalIterations = materialdata.length
    // let completedIterations = 0

    // materialdata.forEach(function (item, index) {
    //   const { productid, quantity, unitDeduction } = item

    //   let sql_check = `select * from production_material_count where pmc_productid='${productid}'`

    //   mysql.Select(sql_check, 'ProductionMaterialCount', (err, result) => {
    //     if (err) {
    //       console.error('Error: ', err)
    //       return res.json({ msg: err })
    //     }

    //     if (result.length != 0) {
    //       const { unit } = result[0]

    //       const ratio = convert(unit, unitDeduction)

    //       const convertedQuantity = quantity * ratio
    //       // console.log(
    //       //   `Converted Quantity from ${unitDeduction} to ${unit}:`,
    //       //   convertedQuantity
    //       // );

    //       let getquantity = `select pmc_quantity as existingquantity from production_material_count where pmc_productid='${productid}'`

    //       mysql.SelectResult(getquantity, (err, result) => {
    //         if (err) {
    //           return res.json({ msg: err })
    //         }
    //         let currentQuantity = result[0].existingquantity
    //         let totalQuantity = parseFloat(currentQuantity) + parseFloat(convertedQuantity)
    //         let sql_Update = `UPDATE production_material_count SET pmc_quantity = ?, pmc_updateddate = ? WHERE pmc_productid = ?`

    //         let data = [totalQuantity, helper.GetCurrentDatetime(), productid]
    //         //console.log(data)

    //         mysql.UpdateMultiple(sql_Update, data, (err, result) => {
    //           if (err) {
    //             console.error('Error: ', err)
    //           }
    //           completedIterations++
    //           if (completedIterations === totalIterations) {
    //             res.json({
    //               msg: 'success',
    //               data: result,
    //             })
    //           }
    //         })
    //       })
    //     }
    //   })
    // })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/status', (req, res) => {
  try {
    let countid = req.body.countid
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    let data = [status, countid]
    //console.log(data)

    let sql_Update = `UPDATE production_material_count SET pmc_status = ? WHERE pmc_countid = ?`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

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

router.post('/getcurrentquantity', (req, res) => {
  try {
    let productid = req.body.productid
    let sql = `select pmc_quantity as currentquantity from production_material_count where pmc_productid='${productid}'`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

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

router.post('/getUnits', (req, res) => {
  try {
    let productid = req.body.productid
    let sql = `select pmc_unit as unit from production_material_count where pmc_productid='${productid}'`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

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

router.get('/getmaterial', (req, res) => {
  try {
    let sql = `SELECT mpm_productid as id, mpm_productname as materialname, mpm_category as category, pmc_unit as unit, pmc_quantity as quantity, mpm_price as unitcost
        FROM salesinventory.production_materials
        INNER JOIN production_material_count ON pmc_productid = mpm_productid;`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

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
