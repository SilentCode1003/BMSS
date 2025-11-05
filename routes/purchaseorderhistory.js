const express = require('express')
const router = express.Router()

const { SelectStatement } = require('../repository/helper/customhelper')
const { SelectAll, Query, Transaction, Check } = require('../repository/utility/query.util')
const mysql = require('../repository/helper/bmssdb')
const helper = require('../repository/helper/customhelper')
const dictionary = require('../repository/helper/dictionary')
const { Validator } = require('../repository/controller/middleware')

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
    FROM purchase_order
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
