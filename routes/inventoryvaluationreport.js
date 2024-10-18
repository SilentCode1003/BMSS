var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'inventoryvaluationreport')
})

router.post('/save', (req, res) => {
  try {
    let valuationdata = JSON.parse(req.body.valuationdata)
    let notes = req.body.notes
    let generatedby = req.session.employeeid
    let reportdate = helper.GetCurrentDatetime()
    // console.log(notes)
    // console.log(valuationdata)
    let data = []

    function insertvaluationitems(reportid) {
      valuationdata.forEach(function (item, index) {
        let valuationitem = []
        let productname = item.productname
        let branchid = item.branchid
        let productid = item.productid
        let unitcost = item.unitcost
        let quantity = item.quantity
        let category = item.category
        let totalvalue = item.totalvalue

        valuationitem.push([
          reportid,
          productid,
          quantity,
          unitcost,
          totalvalue,
          branchid,
          category,
          productname,
        ])
        // console.log(valuationitem)
        mysql.InsertTable('inventory_valuation_items', valuationitem, (err, result) => {
          if (err) console.error('Error: ', err)
        })
      })
      res.json({
        msg: 'success',
      })
    }

    data.push([reportdate, generatedby, notes])

    mysql.InsertTable('inventory_valuation_report', data, (err, result) => {
      if (err) console.error('Error: ', err)

      // //console.log(result[0]['id'])
      let reportid = result[0]['id']

      insertvaluationitems(reportid)
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.get('/load', (req, res) => {
  try {
    let sql = `select * from inventory_valuation_report`

    mysql.Select(sql, 'InventoryValuationReport', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      //console.log(helper.GetCurrentDatetime())

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
  //console.log('Something')
})

router.get('/getbycategory', (req, res) => {
  try {
    let category = req.body.category
    let sql = `select * from master_products where mp_category = '${category}'`

    mysql.Select(sql, 'MasterProducts', (err, result) => {
      if (err) console.error('Error: ', err)

      //console.log(result);

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

router.post('/getvaluationitems', (req, res) => {
  try {
    let reportid = req.body.reportid
    //console.log(reportid)
    let sql = `select * from inventory_valuation_items where ivi_reportid = '${reportid}'`

    mysql.Select(sql, 'InventoryValuationItems', (err, result) => {
      if (err) console.error('Error: ', err)

      //console.log(result);

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

module.exports = router
