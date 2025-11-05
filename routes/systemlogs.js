var express = require('express')
var router = express.Router()

const { Validator } = require('../repository/controller/middleware')
const { JsonResponseError, JsonResponseData } = require('../repository/helper/response')
const { SelectStatement, GetCurrentDate } = require('../repository/helper/customhelper')
const { DataModeling } = require('../repository/model/bmssmodel')
const { BMSS } = require('../repository/model/bmms')
const { Select } = require('../repository/helper/dnconnect')
const { InsertTable, Selects } = require('../repository/helper/bmssdb')

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

    data.push([logid, logdate, loglevel, source, message, userid, ipaddress])
    InsertTable('system_logs', data, (err, result) => {
      if (err) console.error('Error: ', err)
      res.status(200).json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/load', (req, res) => {
  try {
    async function ProcessData() {
      let select_sql = SelectStatement(
        `SELECT * FROM system_logs WHERE sl_logdate BETWEEN ? AND ?`,
        [`${GetCurrentDate()} 00:00:00`, `${GetCurrentDate()} 23:59:59`]
      )

      let result = await Select(select_sql)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.system_logs.prefix_)))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/filter/:daterange', (req, res) => {
  try {
    async function ProcessData() {
      const { daterange } = req.params
      let [startdate, enddate] = daterange.split(' - ')

      let select_sql = SelectStatement(
        'SELECT * FROM system_logs where sl_logdate BETWEEN ? AND ?',
        [`${startdate} 00:00:00`, `${enddate} 23:59:59`]
      )

      let result = await Select(select_sql)
      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.system_logs.prefix_)))
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
