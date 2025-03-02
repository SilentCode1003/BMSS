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
  InsertStatementNoPrefix,
  UpdateStatementNoPrefix,
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
  Validator(req, res, 'posconfig')
})

router.get('/load', (req, res) => {
  try {
    async function ProcessData() {
      let select_sql = SelectAllStatement(BMSS.pos_config.tablename, BMSS.pos_config.selectColumns)

      let result = await Select(select_sql)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.pos_config.prefix_)))
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
    async function ProcessData() {
      const {
        posid,
        posprinterip,
        productionprinterip,
        printername,
        papersize,
        isblutooth,
        isprinter,
        iscashdrawer,
      } = req.body

      let check_sql = SelectStatementCondition(
        BMSS.pos_config.tablename,
        BMSS.pos_config.selectColumns,
        [BMSS.pos_config.selectOptionsColumns.pos_id]
      )

      let exist = await SelectWithCondition(check_sql, posid)

      if (exist.length > 0) {
        res.status(200).json(JsonResponseExist())
        return
      }

      let issync = false
      let insert_sql = InsertStatement(
        BMSS.pos_config.tablename,
        BMSS.pos_config.prefix,
        BMSS.pos_config.insertColumns
      )

      let data = [
        [
          posid,
          posprinterip,
          productionprinterip,
          papersize,
          printername,
          isblutooth == 'true' ? 1 : 0,
          isprinter == 'true' ? 1 : 0,
          iscashdrawer == 'true' ? 1 : 0,
          issync,
        ],
      ]

      let result = await Insert(insert_sql, data)

      console.log(result)

      res.status(200).json(JsonResponseSuccess())
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
        'SELECT * FROM pos_config where cd_datetime BETWEEN ? AND ?',
        [startdate, enddate]
      )

      let result = await Select(select_sql)
      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, BMSS.pos_config.prefix_)))
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

router.put('/update', function (req, res) {
  try {
    async function ProcessData() {
      const {
        id,
        posid,
        posprinterip,
        productionprinterip,
        printername,
        papersize,
        isblutooth,
        isprinter,
        iscashdrawer,
      } = req.body

      console.log(
        id,
        posid,
        posprinterip,
        productionprinterip,
        printername,
        papersize,
        isblutooth,
        isprinter,
        iscashdrawer
      )

      let update_sql = UpdateStatementNoPrefix(
        BMSS.pos_config.tablename,
        [
          BMSS.pos_config.selectOptionsColumns.pos_id,
          BMSS.pos_config.selectOptionsColumns.pos_printer,
          BMSS.pos_config.selectOptionsColumns.production_kitchen_printer_ip,
          BMSS.pos_config.selectOptionsColumns.printer_name,
          BMSS.pos_config.selectOptionsColumns.paper_size,
          BMSS.pos_config.selectOptionsColumns.isblutooth,
          BMSS.pos_config.selectOptionsColumns.isprinter,
          BMSS.pos_config.selectOptionsColumns.iscashdrawer,
          BMSS.pos_config.selectOptionsColumns.issync,
        ],
        [BMSS.pos_config.selectOptionsColumns.id]
      )

      console.log(update_sql)

      let data = [
        posid,
        posprinterip,
        productionprinterip,
        printername,
        papersize,
        isblutooth == 'true' ? 1 : 0,
        isprinter == 'true' ? 1 : 0,
        iscashdrawer == 'true' ? 1 : 0,
        0,
        id,
      ]

      let result = await Update(update_sql, data)

      console.log(result)

      res.status(200).json(JsonResponseSuccess())
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router
