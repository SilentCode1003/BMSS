const express = require('express')
const router = express.Router()

const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
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
  GetPreviousMonthFirstDay,
  GetCurrentMonthLastDay,
} = require('../repository/helper/customhelper')
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
const { Setting } = require('../repository/model/setting')

router.get('/', function (req, res, next) {
  res.render('routes', {
    positiontype: 'Developer',
    accesstype: 'Owner',
    username: 'DEV42',
    fullname: 'DEV42',
    employeeid: '0000000',
    branchid: 9999,
    usercode: 9999,
    title: 'TEST',
  })
})

router.get('/get-routes', async (req, res) => {
  try {
    let select_sql = SelectStatement('SELECT * FROM routes')
    console.log(select_sql)
    let routes = await Select(select_sql)

    if (routes.length > 0) {
      res.status(200).json(JsonResponseData(DataModeling(routes, Setting.routes.prefix_)))
    } else {
      res.status(200).json(JsonResponseData(routes))
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/add-route', async (req, res) => {
  try {
    const { routename, layout, route } = req.body
    const { fullname } = req.session
    const status = UPSERT_STATUS.ACTIVE
    const create_at = GetCurrentDatetime()
    let data = [[routename, route, layout, status, fullname, create_at]]

    let select_check_sql = SelectStatement(
      `
      SELECT * FROM routes
      where r_name = ?
      and r_route = ?
      and r_layout = ?`,
      [routename, route, layout]
    )

    let checkResult = await Check(select_check_sql, data)

    if (checkResult) {
      res.status(400).json(JsonResponseError(`${routename} - ${route} already exists`))
      return
    }

    let insert_sql = InsertStatement(
      Setting.routes.tablename,
      Setting.routes.prefix,
      Setting.routes.insertColumns
    )

    let insert_result = await Insert(insert_sql, data)

    res.status(200).json(JsonResponseSuccess())
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router
