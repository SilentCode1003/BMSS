const express = require('express')
const router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const { DataModeling } = require('./model/bmssmodel')
const { InsertStatement } = require('./repository/customhelper')
const { Query, Transaction } = require('./utility/query.util')
const { sq } = require('date-fns/locale')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'stockadjustment')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    const sql = `SELECT sad_id, mb_branchname AS sad_branchname, sad_branchid, sad_createddate, me_fullname as sad_createdby, sad_status, sad_details
    FROM stock_adjustment_detail
    INNER JOIN master_branch ON sad_branchid = mb_branchid
    INNER JOIN master_employees ON sad_createdby = me_employeeid
    ORDER BY sad_id desc`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      const data = DataModeling(result, 'sad_')
      res.json({
        msg: 'success',
        data: data,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.get('/:id', (req, res) => {
  try {
    const id = req.params.id

    const adjustmentDetail = `SELECT sad_id, mb_branchname AS sad_branchid, sad_details, sad_reason, sad_createddate, me_fullname as sad_createdby, sad_notes, sad_status, sad_attachments
      FROM stock_adjustment_detail
      INNER JOIN master_branch ON sad_branchid = mb_branchid
      INNER JOIN master_employees ON sad_createdby = me_employeeid
      WHERE sad_id = ${id}`

    const adjustmentItems = `SELECT sai_id, sai_detailid, mp_description as sai_productname, mp_productid as sai_productid, sai_quantity, sai_stockafter AS stockafter FROM stock_adjustment_item
      INNER JOIN master_product ON mp_productid = sai_productid
      WHERE sai_detailid = ${id}`

    mysql.SelectResult(adjustmentDetail, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      const details = DataModeling(result, 'sad_')
      mysql.SelectResult(adjustmentItems, (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          })
        }
        const items = DataModeling(result, 'sai_')
        res.json({
          msg: 'success',
          data: { details, items },
        })
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
    const { branch, reason, details, notes, adjustmentData, attachments } = req.body
    // res.status(200), res.json({ data: adjustmentData });

    if (!branch || !reason || !details || !notes || !adjustmentData) {
      res.status(400), res.json({ msg: 'All fields are required' })
    }

    const status = dictionary.GetValue(dictionary.PND())
    const createdby = req.session.employeeid ? req.session.employeeid : 200000
    const createddate = helper.GetCurrentDatetime()
    let logdata = []
    let data = []

    const insertQuery = InsertStatement('stock_adjustment_detail', 'sad', [
      'branchid',
      'details',
      'reason',
      'createddate',
      'createdby',
      'notes',
      'status',
      'attachments',
    ])

    data.push([branch, details, reason, createddate, createdby, notes, status, attachments])
    // console.log(insertQuery);
    mysql.InsertDynamic(insertQuery, data, (err, result) => {
      if (err) console.log('Error: ', err)
      let loglevel = dictionary.INF()
      let source = dictionary.INV()
      let message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`
      let user = req.session.employeeid ? req.session.employeeid : 200000

      Logger(loglevel, source, message, user)

      const id = result[0].id

      const insertAdjustmentItems = InsertStatement('stock_adjustment_item', 'sai', [
        'detailid',
        'productid',
        'quantity',
        'stockafter',
      ])

      adjustmentData.forEach((row) => {
        const { productid, quantity } = row
        const adjustmentItems = [[id, parseInt(productid), parseInt(quantity), 0]]

        mysql.InsertDynamic(insertAdjustmentItems, adjustmentItems, (err, result) => {
          if (err) {
            console.error('Error: ', err)
          }
        })
      })

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

router.patch('/approve', async (req, res) => {
  const { adjustmentId, branch } = req.body
  let queries = []

  if (!adjustmentId || !branch) {
    res.status(400), res.json({ msg: 'All fields are required' })
  }
  try {
    const response = await Query(`SELECT * FROM stock_adjustment_item WHERE sai_detailid = ?`, [
      adjustmentId,
    ])
    if (response.length == 0) {
      res.status(400), res.json({ msg: 'No data found' })
    }
    const adjustmentItems = DataModeling(response, 'sai_')

    for (const row of adjustmentItems) {
      const { id, detailid, productid, quantity, stockafter } = row
      const inventoryId = `${productid}${branch}`

      const inventoryResponse = await Query(
        `SELECT * FROM product_inventory WHERE pi_inventoryid = ?`,
        [inventoryId]
      )

      const inventoryData = DataModeling(inventoryResponse, 'pi_')
      const currentQUantity = inventoryData[0].quantity
      const newQuantity = parseInt(currentQUantity) + parseInt(quantity)

      //@Insert History
      const history = {
        sql: 'INSERT INTO history (h_branch, h_quantity, h_date, h_productid, h_inventoryid, h_movementid, h_type, h_stocksafter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        values: [
          branch,
          quantity,
          helper.GetCurrentDatetime(),
          productid,
          inventoryId,
          adjustmentId,
          'ADJUSTMENT',

          newQuantity,
        ],
      }
      queries.push(history)

      //@Update Inventory
      const updateInventory = {
        sql: helper.UpdateStatement('product_inventory', 'pi', ['quantity'], ['inventoryid']),
        values: [newQuantity, inventoryId],
      }
      queries.push(updateInventory)

      //@Update Stocks
      const updateStocks = {
        sql: helper.UpdateStatement('stock_adjustment_item', 'sai', ['stockafter'], ['id']),
        values: [newQuantity, id],
      }
      queries.push(updateStocks)
    }

    //@Update Adjustment Status
    const updateStatus = {
      sql: helper.UpdateStatement('stock_adjustment_detail', 'sad', ['status'], ['id']),
      values: [dictionary.GetValue(dictionary.CMP()), adjustmentId],
    }
    queries.push(updateStatus)
    //console.log(queries)

    await Transaction(queries)
    res.status(200).json({ msg: 'success', data: queries })
  } catch (err) {
    console.log(err)
    res.status(400), res.json({ msg: 'error' })
  }
})

router.patch('/cancel', (req, res) => {
  try {
    const { adjustmentId } = req.body
    const status = dictionary.GetValue(dictionary.CND())
    if (!adjustmentId || !status) {
      res.status(400), res.json({ msg: 'All fields are required' })
    }

    const updateAdjustmentStatus = helper.UpdateStatement(
      'stock_adjustment_detail',
      'sad',
      ['status'],
      ['id']
    )
    const data = [status, adjustmentId]

    mysql.UpdateMultiple(updateAdjustmentStatus, data, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.status(400)
      }
      res.status(200), res.json({ msg: 'success' })
    })
  } catch (err) {
    console.log(err)
    res.status(400), res.json({ msg: 'error' })
  }
})
