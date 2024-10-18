var express = require('express')
var router = express.Router()

const { Validator } = require('./controller/middleware')
const {
  convert,
  GetCurrentDatetime,
  InsertStatement,
  SelectStatement,
  UpdateStatement,
} = require('./repository/customhelper')
const { DataModeling } = require('./model/bmssmodel')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')
const { ProductionStatus } = require('./repository/enums')
const { Insert, SelectResult, Update, UpdateMultiple } = require('./repository/bmssdb')
const { sq, da } = require('date-fns/locale')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'materialstockadjustment')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT * FROM production_material_stock_adjustment WHERE pmsa_status = ? ORDER BY pmsa_id DESC`
    let cmd = SelectStatement(sql, [ProductionStatus.Pending])

    SelectResult(cmd, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      if (result.length != 0) {
        let data = DataModeling(result, 'pmsa_')

        res.json({
          msg: 'success',
          data: data,
        })
      } else {
        res.json({
          msg: 'success',
          data: result,
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/save', (req, res) => {
  try {
    const { materialdata, note } = req.body
    let status = ProductionStatus.Pending
    let date = GetCurrentDatetime()
    let sql = InsertStatement('production_material_stock_adjustment', 'pmsa', [
      'date',
      'note',
      'content',
      'status',
    ])
    let data = [[date, note, materialdata, status]]

    Insert(sql, data, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      res.status(200).json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/getadjustmentdetails', (req, res) => {
  try {
    const { adjustmentid } = req.body
    let sql = 'SELECT * FROM production_material_stock_adjustment WHERE pmsa_id = ?'
    let cmd = SelectStatement(sql, [adjustmentid])

    SelectResult(cmd, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      let data = DataModeling(result, 'pmsa_')
      let content = JSON.parse(data[0].content)

      //console.log(content)

      res.status(200).json({
        msg: 'success',
        data: content,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/approve', (req, res) => {
  try {
    const { adjustmentid } = req.body
    let status = ProductionStatus.Approved

    let sql = 'select pmsa_content from production_material_stock_adjustment where pmsa_id = ?'
    let cmd = SelectStatement(sql, [adjustmentid])

    let queries = []

    SelectResult(cmd, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      let Content = JSON.parse(result[0].pmsa_content)

      const processContent = async () => {
        for (const row of Content) {
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
          const oldUnit = response[0].unit
          const existingQuantity = response[0].quantity
          const countId = response[0].countid

          const ratio = convert(oldUnit, unitDeduction)
          const convertedQuantity = quantity * ratio

          const totalQuantity = parseFloat(existingQuantity) + parseFloat(convertedQuantity)

          queries.push({
            sql: 'UPDATE production_material_count SET pmc_quantity = ?, pmc_updateddate = ? WHERE pmc_productid = ?',
            values: [totalQuantity, GetCurrentDatetime(), productid],
          })

          queries.push({
            sql: 'INSERT INTO production_material_history (pmh_countId, pmh_baseQuantity, pmh_movementUnit, pmh_baseUnit, pmh_convertedQuantity, pmh_movementId, pmh_type, pmh_date, pmh_stocksBefore, pmh_stocksAfter, pmh_unitBefore, pmh_unitAfter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values: [
              countId,
              quantity,
              unitDeduction ? unitDeduction : oldUnit,
              oldUnit,
              convertedQuantity,
              adjustmentid,
              ProductionStatus.Adjustment,
              GetCurrentDatetime(),
              existingQuantity,
              totalQuantity,
              oldUnit,
              oldUnit,
            ],
          })

          queries.push({
            sql: 'update production_material_stock_adjustment set pmsa_status= ? where pmsa_id = ?',
            values: [status, adjustmentid],
          })
        }
        const transac = await Transaction(queries)

        if (transac) {
          res.json({
            msg: 'success',
          })
        } else {
          res.status(400).json({
            msg: 'error',
          })
        }
      }

      processContent()
    })
  } catch (error) {
    res.status(500).json({
      msg: error,
    })
  }
})

router.post('/cancel', (req, res) => {
  try {
    const { adjustmentid } = req.body
    const status = ProductionStatus.Cancelled
    let sql = 'update production_material_stock_adjustment set pmsa_status= ? where pmsa_id = ?'
    let data = [status, adjustmentid]
    let cmd = UpdateStatement('production_material_stock_adjustment', 'pmsa', ['status'], ['id'])

    UpdateMultiple(cmd, data, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      res.status(200).json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.status(500).json({
      msg: error,
    })
  }
})
