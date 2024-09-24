var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'systemlogs')
})

module.exports = router

router.post('/save', (req, res) => {
  try {
    let logid = req.body.logid
    let logdate = req.body.logdate
    let loglevel = req.body.loglevel
    let source = req.body.source
    let message = req.body.message
    let userid = req.body.userid
    let ipaddress = req.body.ipaddress
    let data = []

    let sql_check = `select * from system_logs where sl_logid='${logid}'`
    mysql.Select(sql_check, 'SystemLogs', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        data.push([logid, logdate, loglevel, source, message, userid, ipaddress])
        mysql.InsertTable('system_logs', data, (err, result) => {
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

router.get('/load', (req, res) => {
  try {
    let sql = `select * from system_logs ORDER BY sl_logid DESC`

    mysql.Select(sql, 'SystemLogs', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      console.log(helper.GetCurrentDatetime())

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
