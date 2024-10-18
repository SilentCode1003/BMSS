var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'productioninventory')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `select * from production_inventory`

    mysql.Select(sql, 'ProductionInventory', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      //console.log(helper.GetCurrentDatetime());

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

router.post('/getquantity', (req, res) => {
  try {
    let productid = req.body.productid

    let sql = `select pi_quantity from production_inventory where pi_productid = '${productid}'`
    mysql.Select(sql, 'ProductionInventory', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      //console.log(helper.GetCurrentDatetime());

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
