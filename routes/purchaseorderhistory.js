const express = require('express')
const router = express.Router()

const crypto = require('crypto')
const mysql = require('./repository/bmssdb')
const { SelectStatement } = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'purchaseorderhistory')
})

module.exports = router

router.get('/load', async (req, res) => {
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
    WHERE NOT po_status IN ('NOT COMPLETE','PENDING')
    ORDER BY po_orderid DESC`

    const response = await Query(loadPurchaseOrder, [], 'po_')

    res.status(200).json({
      msg: 'success',
      data: response,
    })
  } catch (error) {
    res.status(500).send(error)
  }
})
