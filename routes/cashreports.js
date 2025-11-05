var express = require('express')
var router = express.Router()

const mysql = require('../repository/helper/bmssdb')
const helper = require('../repository/helper/customhelper')
const dictionary = require('../repository/helper/dictionary')
const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const { Select } = require('../repository/helper/dnconnect')
const { JsonResponseData, JsonResponseError } = require('../repository/helper/response')
const { DataModeling } = require('../repository/model/bmssmodel')
const { BMSS } = require('../repository/model/bmms')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'cashreports')
})

module.exports = router

router.post('/save', (req, res) => {
  try {
    let reportid = req.body.reportid
    let date = req.body.date
    let shift = req.body.shift
    let pos = req.body.pos
    let cashier = req.body.cashier
    let type = req.body.type
    let status = req.body.status
    let data = []

    let sql_check = `select * from cash_report where cr_report_id='${reportid}'`
    mysql.Select(sql_check, 'CashReport', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        data.push([reportid, date, shift, pos, cashier, type, status])
        mysql.InsertTable('cash_report', data, (err, result) => {
          if (err) console.error('Error: ', err)

          //console.log(result);

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.get('/getcashreport', (req, res) => {
  try {
    async function ProcessData() {
      let current_date = helper.GetCurrentDate()
      let select_sql = helper.SelectStatement(
        `select
            mb_branchname as cr_branch_name,
            ccf_date as cr_shift_date,
            ccf_pos as cr_pos_id,
            ccf_shift as cr_shift,
            ccf_cash_float as cr_cash_float,
            cr_total as cr_total_cash,
            cr_denomination as cr_denomination 
            from cashdrawer_report
            inner join cashdrawer_cash_float
            on cr_branch_id = ccf_branch_id
            and cr_pos_id = ccf_pos
            and cr_shift = ccf_shift
            and cr_date = ccf_date
            inner join master_branch
            on mb_branchid = ccf_branch_id
            where cr_date = ?`,
        [current_date]
      )

      let result = await Select(select_sql)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.cashdrawer_report.prefix_)))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/getdenomination', (req, res) => {
  try {
    const { branch, shiftdate, posid, shift } = req.body

    console.log(branch, shiftdate, posid, shift)

    let sql = `
    select cr_denomination as denomination from cashdrawer_report 
    inner join master_branch on mb_branchid = cr_branch_id
    where mb_branchname = ?
    and cr_shift =  ?
    and cr_date =  ?
    and cr_pos_id =  ?`
    let cmd = helper.SelectStatement(sql, [branch, shift, shiftdate, posid])

    mysql.SelectResult(cmd, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }

      res.status(200).json(JsonResponseData(JSON.parse(result[0].denomination)))
    })
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/filter/:daterange', (req, res) => {
  try {
    async function ProcessData() {
      const { daterange } = req.params
      let [startdate, enddate] = daterange.split(' - ')

      let select_sql = helper.SelectStatement(
        `select
            mb_branchname as cr_branch_name,
            ccf_date as cr_shift_date,
            ccf_pos as cr_pos_id,
            ccf_shift as cr_shift,
            ccf_cash_float as cr_cash_float,
            cr_total as cr_total_cash,
            cr_denomination as cr_denomination 
            from cashdrawer_report
            inner join cashdrawer_cash_float
            on cr_branch_id = ccf_branch_id
            and cr_pos_id = ccf_pos
            and cr_shift = ccf_shift
            and cr_date = ccf_date
            inner join master_branch
            on mb_branchid = ccf_branch_id
            where cr_date BETWEEN '${startdate}' AND '${enddate}'`,
        [startdate, enddate]
      )

      let result = await Select(select_sql)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.cashdrawer_report.prefix_)))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
