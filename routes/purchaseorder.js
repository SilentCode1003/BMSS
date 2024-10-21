const express = require('express')
const router = express.Router()

const crypto = require('crypto')
const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'purchaseorder')
})

module.exports = router

router.get('/load', async (req, res) => { //NOT po_status IN ('COMPLETED','CANCELLED') 
  try {
    const loadPurchaseOrder = `SELECT po_orderid as po_orderid, 
                              mv_vendorname as po_vendorid, 
                              po_orderdate as po_orderdate, 
                              po_deliverydate as po_deliverydate,
                              po_total_amount as po_total_amount, 
                              po_paymentterms as po_paymentterms, 
                              po_deliverymethod as po_deliverymethod, 
                              po_status po_status
                              FROM salesinventory.purchase_order
                              INNER JOIN master_vendor on mv_vendorid = po_vendorid
                              ORDER BY po_orderid DESC`

    const response = await Query(loadPurchaseOrder, [], 'po_')

    res.status(200).json({
      msg: 'success',
      data: response,
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.post('/save', (req, res) => {
  try {
    const { vendorid, orderdate, deliverydate, totalamount, paymentterms, deliverymethod } =
      req.body

    let status = dictionary.GetValue(dictionary.PND())
    let data = []

    data.push([
      vendorid,
      orderdate,
      deliverydate,
      totalamount,
      paymentterms,
      deliverymethod,
      status,
    ])

    // console.log(data, "Data")

    mysql.InsertTable('purchase_order', data, (err, result) => {
      if (err) console.error('Error: ', err)
      let purchaseid = result[0]['id']
      let poiData = JSON.parse(req.body.poiData)
      // console.log(poiData);
      poiData.forEach(function (item, index) {
        let description = item.description
        let quantity = item.quantity
        let unitprice = item.unitprice
        let totalprice = item.totalprice

        let rowData = [purchaseid, description, quantity, unitprice, totalprice]

        //  //console.log(rowData);
        mysql.InsertTable('purchase_order_items', [rowData], (err, result) => {
          if (err) console.error('Error: ', err)
          // //console.log(result)
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

router.post('/approve', (req, res) => {
  try {
    let orderid = req.body.orderid
    let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.APD())
        : dictionary.GetValue(dictionary.PND())
    let data = [status, orderid]
    //console.log(data)

    let sql_Update = `UPDATE purchase_order SET po_status = ? WHERE po_orderid = ?`

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

router.post('/cancel', (req, res) => {
  try {
    let orderid = req.body.orderid
    let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.CND())
        : dictionary.GetValue(dictionary.PND())
    let data = [status, orderid]
    //console.log(data)

    let sql_Update = `UPDATE purchase_order 
                      SET po_status = ?
                      WHERE po_orderid = ?`

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

router.post('/completed', (req, res) => {
  try {
    let orderid = req.body.orderid
    let status = dictionary.GetValue(dictionary.CMP())
    let data = [status, orderid]
    //console.log(data)

    let sql_Update = `UPDATE purchase_order 
                      SET po_status = ?
                      WHERE po_orderid = ?`

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

router.get('/loadsampleitem', (req, res) => {
  try {
    let sql = `select * from sample_itemlists`

    mysql.Select(sql, 'SampleItemLists', (err, result) => {
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
})

router.post('/getitemdetails', (req, res) => {
  try {
    let description = req.body.description
    let sql = `select * from sample_itemlists where sil_description = '${description}'`

    mysql.Select(sql, 'SampleItemLists', (err, result) => {
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

router.post('/getorderdetails', (req, res) => {
  try {
    let orderid = req.body.orderid
    let sql = `select poi_productid as productid, poi_orderid as orderid, mpm_productname as description, poi_quantity as quantity, 
              poi_unitprice as unitprice, poi_totalprice as totalprice, poi_description as materialid
              from purchase_order_items 
              INNER JOIN production_materials ON mpm_productid = poi_description 
                where poi_orderid = '${orderid}'`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      // //console.log(result)
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

router.post('/checkordercomplete', async (req, res) => {
  try {
    let orderid = req.body.orderid
    let orderstatus = 'NOT COMPLETE'

    const response = await Query(
      `
      select 
          poi_productid as productid, 
          poi_orderid as orderid, 
          mpm_productname as description, 
          poi_quantity as quantity, 
          poi_unitprice as unitprice, 
          poi_totalprice as totalprice, 
          CASE WHEN isnull(pmh_type) THEN 0 ELSE SUM(pmh_baseQuantity) END  AS receive,
          poi_description AS materialid
          from purchase_order
          inner join purchase_order_items on po_orderid = poi_orderid
          inner join production_materials on mpm_productid = poi_description
          left join production_material_history on pmh_movementId = po_orderid and pmh_countId = poi_description and pmh_type = 'REPLENISHMENT'
          WHERE poi_orderid = ?
          GROUP BY productid`,
      [orderid],
      'o_'
    )

    let datalength = response.length
    let count = 0

    for (const item of response) {
      //console.log(item.quantity, parseFloat(item.receive))
      if (item.quantity == parseFloat(item.receive)) {
        count += 1
      }

      if (count == datalength) {
        orderstatus = 'COMPLETE'
      }
    }

    //console.log(orderstatus)

    res.status(200).json({
      msg: 'success',
      data: orderstatus,
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/notcompleted', (req, res) => {
  try {
    let orderid = req.body.orderid
    let status = 'NOT COMPLETE'
    let data = [status, orderid]
    //console.log(data)

    let sql_Update = `UPDATE purchase_order 
                      SET po_status = ?
                      WHERE po_orderid = ?`

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

router.post('/getincompleteorderdetails', (req, res) => {
  try {
    let orderid = req.body.orderid

    async function ProcessData() {
      const response = await Query(
        `select 
            poi_productid as productid, 
            poi_orderid as orderid, 
            mpm_productname as description, 
            poi_quantity as quantity, 
            poi_unitprice as unitprice, 
            poi_totalprice as totalprice, 
            CASE WHEN isnull(pmh_type) THEN 0 ELSE SUM(pmh_baseQuantity) END  AS receiveorder,
            poi_description AS materialid
            from purchase_order
            inner join purchase_order_items on po_orderid = poi_orderid
            inner join production_materials on mpm_productid = poi_description
            left join production_material_history on pmh_movementId = po_orderid and pmh_countId = poi_description and pmh_type = 'REPLENISHMENT'
            WHERE poi_orderid = ?
            GROUP BY productid`,
        [orderid],
        'o_'
      )

      //console.log(response)

      res.status(200).json({
        msg: 'success',
        data: response,
      })
    }

    ProcessData()
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
