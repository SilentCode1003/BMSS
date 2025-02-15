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
} = require('../repository/helper/response')
const { SelectAllStatement, InsertStatement } = require('../repository/helper/customhelper')
const { BMSS } = require('../repository/model/bmms')
const { DataModeling } = require('../repository/model/bmssmodel')
const { Select, Insert } = require('../repository/helper/dnconnect')
const { UPSERT_STATUS } = require('../repository/helper/enums')

router.get('/', function (req, res, next) {
  Validator(req, res, 'denomination')
})

router.get('/getdenomination', (req, res) => {
  try {
    async function ProcessData() {
      let select_sql = SelectAllStatement(
        BMSS.master_denomination.tablename,
        BMSS.master_denomination.selectColumns
      )

      let result = await Select(select_sql)

      console.log(result)

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

router.post('/adddenomination', (req, res) => {
  try {
    const { code, description, value } = req.body
    let status = UPSERT_STATUS.ACTIVE

    async function ProcessData() {
      let insert_data = [[code, description, value, status]]
      let insert_sql = InsertStatement(
        BMSS.master_denomination.tablename,
        BMSS.master_denomination.insertColumns,
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

module.exports = router
