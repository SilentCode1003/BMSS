var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'salesinventoryhistory')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT * FROM sales_inventory_history`

    mysql.Select(sql, 'SalesInventoryHistory', (err, result) => {
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

router.post('/save', (req, res) => {
  try {
    let date = req.body.date
    let productid = req.body.productid
    let branch = req.body.branch
    let quantity = req.body.quantity
    let data = []

    data.push([date, productid, branch, quantity])
    mysql.InsertTable('sales_inventory_history', data, (err, result) => {
      if (err) console.error('Error: ', err)

      //console.log(result);
    })
    res.json({
      msg: 'success',
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
