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
} = require('../repository/helper/customhelper')
const { BMSS } = require('../repository/model/bmms')
const { DataModeling } = require('../repository/model/bmssmodel')
const { Select, Insert, SelectWithCondition, Update } = require('../repository/helper/dnconnect')
const { UPSERT_STATUS } = require('../repository/helper/enums')
const { INF, MSTR, GetValue, INSD } = require('../repository/helper/dictionary')

router.get('/', function (req, res, next) {
  Validator(req, res, 'denomination')
})

router.get('/load', (req, res) => {
  try {
    async function ProcessData() {
      let select_sql = SelectAllStatement(
        BMSS.master_denomination.tablename,
        BMSS.master_denomination.selectColumns
      )

      let result = await Select(select_sql)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, 'md_')))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/save', (req, res) => {
  try {
    const { code, description, value } = req.body
    let status = UPSERT_STATUS.ACTIVE
    let create_by = req.session.employeeid
    let create_date = GetCurrentDatetime()

    async function ProcessData() {
      let check_sql = SelectStatementCondition(
        BMSS.master_denomination.tablename,
        [BMSS.master_denomination.selectOptionsColumns.value],
        [BMSS.master_denomination.selectOptionsColumns.value]
      )

      let check_result = await SelectWithCondition(check_sql, [value])

      if (check_result.length != 0) {
        return res.status(200).json(JsonResponseExist())
      }

      let insert_data = [[code, description, value, status, create_by, create_date]]
      let insert_sql = InsertStatement(
        BMSS.master_denomination.tablename,
        BMSS.master_denomination.prefix,
        BMSS.master_denomination.insertColumns
      )

      let result = await Insert(insert_sql, insert_data)

      if (result) {
        res.status(200).json(JsonResponseSuccess())
      }
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.put('/update', (req, res) => {
  try {
    const { id, code, description, value } = req.body

    async function ProcessData() {
      let check_sql = SelectStatementCondition(
        BMSS.master_denomination.tablename,
        [BMSS.master_denomination.selectOptionsColumns.value],
        [BMSS.master_denomination.selectOptionsColumns.value]
      )

      let check_result = await SelectWithCondition(check_sql, [value])

      if (check_result.length != 0) {
        return res.status(200).json(JsonResponseExist())
      }

      let update_data = [code, description, value, id]
      let update_sql = UpdateStatement(
        BMSS.master_denomination.tablename,
        BMSS.master_denomination.prefix,
        [
          BMSS.master_denomination.columns.code,
          BMSS.master_denomination.columns.description,
          BMSS.master_denomination.columns.value,
        ],
        [BMSS.master_denomination.columns.id]
      )

      let result = await Update(update_sql, update_data)
      const loglevel = INF()
      const source = MSTR()
      const message = `${GetValue(INSD())} -  [${update_data}]`
      const user = req.session.employeeid
      Logger(loglevel, source, message, user)

      if (result) {
        res.status(200).json(JsonResponseSuccess())
      }
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.put('/status', (req, res) => {
  try {
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router
