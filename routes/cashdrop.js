const express = require('express')
const router = express.Router()

const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const verifyJWT = require('../repository/middleware/authenticator')
const { SelectAll, Query, Check } = require('../repository/utility/query.util')
const {
  JsonResponseError,
  JsonResponseData,
  JsonResponseSuccess,
  JsonResponseExist,
} = require('../repository/helper/response')
const {
  SelectAllStatement,
  InsertStatement,
  GetCurrentDatetime,
  SelectStatement,
  SelectStatementCondition,
  UpdateStatement,
  DeleteStatement,
} = require('../repository/helper/customhelper')
const { BMSS } = require('../repository/model/bmms')
const { DataModeling } = require('../repository/model/bmssmodel')
const {
  Select,
  Insert,
  SelectWithCondition,
  Update,
  Delete,
} = require('../repository/helper/dnconnect')
const { UPSERT_STATUS } = require('../repository/helper/enums')
const { INF, MSTR, GetValue, INSD } = require('../repository/helper/dictionary')

router.get('/', function (req, res, next) {
  Validator(req, res, 'cashdrop')
})

router.get('/load', (req, res) => {
  try {
    async function ProcessData() {
      let select_sql = SelectStatement(`SELECT * FROM cash_drop where cd_shift_date = ?`, [
        GetCurrentDatetime(),
      ])

      let result = await Select(select_sql)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.cash_drop.prefix_)))
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
        'SELECT * FROM cash_drop where cd_datetime BETWEEN ? AND ?',
        [startdate, enddate]
      )

      let result = await Select(select_sql)
      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.cash_drop.prefix_)))
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

module.exports = router
