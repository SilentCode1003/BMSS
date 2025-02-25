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
  Validator(req, res, 'cashdraweractivity')
})

router.get('/load', (req, res) => {
  try {
    async function ProcessData() {
      let select_sql = SelectAllStatement(
        BMSS.cashdrawer_activity.tablename,
        BMSS.cashdrawer_activity.selectColumns
      )

      let result = await Select(select_sql)

      if (result.length != 0) {
        res
          .status(200)
          .json(JsonResponseData(DataModeling(result, BMSS.cashdrawer_activity.prefix_)))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router
