const express = require('express')
const router = express.Router()

const crypto = require('crypto')
const mysql = require('./repository/bmssdb')
const { SelectStatement } = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'transferorderhistory')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT to_transferid as transferid, 
            to_fromlocationid as fromlocationid, 
            to_tolocationid as tolocationid, 
            from_loc.mb_branchname as fromlocbranchname,
            to_loc.mb_branchname as tolocbranchname,
            to_transferdate as transferdate,
            to_totalquantity as totalquantity, 
            to_status as status, 
            to_notes as notes 
          FROM transfer_orders
          INNER JOIN master_branch as from_loc ON to_fromlocationid = from_loc.mb_branchid
          INNER JOIN master_branch as to_loc ON to_tolocationid = to_loc.mb_branchid
          WHERE NOT to_status IN ('NOT COMPLETE','PENDING')
          ORDER BY to_transferid DESC`

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