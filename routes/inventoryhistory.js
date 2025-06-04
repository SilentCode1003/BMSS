var express = require('express')
var router = express.Router()

const mysql = require('../repository/helper/bmssdb')
const {
  SelectStatement,
  UpdateStatement,
  InsertStatement,
  GetPreviousMonthFirstDay,
  GetCurrentMonthLastDay,
} = require('../repository/helper/customhelper')
const { DataModeling } = require('../repository/model/bmssmodel')
const dictionary = require('../repository/helper/dictionary')
const { Validator } = require('../repository/controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'inventoryhistory')
})

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT * FROM inventory_history LIMIT 100`

    mysql.Select(sql, 'InventoryHistory', (err, result) => {
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

router.get('/type', (req, res) => {
  try {
    let sql = `SELECT DISTINCT h_type as type FROM history;`

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

router.get('/history', (req, res) => {
  try {
    let startDate = GetPreviousMonthFirstDay(1)
    let endDate = GetCurrentMonthLastDay()
    let sql = `
    SELECT h_id, 
    h_branch, 
    h_quantity, 
    mp_barcode as h_barcode, 
    h_date, 
    h_productid, 
    h_inventoryid, 
    h_movementid, 
    h_type, 
    h_stocksafter, 
    mb_branchname AS h_branchname,
    mp_description AS h_productname
    FROM history 
    INNER JOIN master_branch as branch ON branch.mb_branchid = h_branch
    INNER JOIN master_product as product ON product.mp_productid = h_productid
    WHERE h_date between '${startDate} 00:00:00' and '${endDate} 23:59:59'
    ORDER BY h_id DESC`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        return (
          res.status(400),
          res.json({
            msg: err,
          })
        )
      }
      const data = DataModeling(result, 'h_')
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

router.get('/filter/:startdate/:enddate', (req, res) => {
  try {
    const { startdate, enddate } = req.params
    let sql = SelectStatement(
      `
        SELECT h_id, 
        h_branch, 
        h_quantity, 
        mp_barcode as h_barcode, 
        h_date, 
        h_productid, 
        h_inventoryid, 
        h_movementid, 
        h_type, 
        h_stocksafter, 
        mb_branchname AS h_branchname,
        mp_description AS h_productname
        FROM history 
        INNER JOIN master_branch as branch ON branch.mb_branchid = h_branch
        INNER JOIN master_product as product ON product.mp_productid = h_productid
        WHERE h_date BETWEEN ? and ?
        ORDER BY h_id DESC
      `,
      [`${startdate} 00:00:00`, `${enddate} 23:59:59`]
    )

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        return (
          res.status(400),
          res.json({
            msg: err,
          })
        )
      }
      const data = DataModeling(result, 'h_')
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

module.exports = router
