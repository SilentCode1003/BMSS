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
  SelectInnerJoin,
  SelectInnerJoinCondition,
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
const { Setting } = require('../repository/model/setting')
const { Masters } = require('../repository/model/masters')

router.get('/', function (req, res, next) {
  res.render('access_route', {
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

router.get('/get-access-route', async (req, res) => {
  try {
    let select_sql = SelectStatement(`SELECT 
      DISTINCT(ar_access_id),
      mat_accessname as ar_access,
      'active' as ar_status
      FROM access_route
      INNER JOIN master_access_type on mat_accesscode = ar_access_id`)
    let routes = await Select(select_sql)

    if (routes.length > 0) {
      res.status(200).json(JsonResponseData(DataModeling(routes, Setting.access_route.prefix_)))
    } else {
      res.status(200).json(JsonResponseData(routes))
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/add-access-route', async (req, res) => {
  try {
    const { access_id } = req.body
    const { fullname } = req.session
    let select_route = SelectStatement(
      'SELECT r_id as id, r_name as name FROM routes where r_status = ?',
      [UPSERT_STATUS.ACTIVE]
    )
    let access_route = []

    let routeResult = await Select(select_route)

    for (var route of routeResult) {
      const { id, name } = route
      access_route.push([
        access_id,
        id,
        'full',
        UPSERT_STATUS.ACTIVE,
        GetCurrentDatetime(),
        fullname,
      ])

      console.log(id, name)
    }

    let insert_access_route = InsertStatement(
      Setting.access_route.tablename,
      Setting.access_route.prefix,
      Setting.access_route.insertColumns
    )

    let result = await Insert(insert_access_route, access_route)
    console.log(result)

    res.status(200).json(JsonResponseSuccess())
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/get-access-route-list/:accessid', async (req, res) => {
  try {
    const { accessid } = req.params
    let select_access_route = SelectInnerJoinCondition(
      [
        Setting.access_route.selectOptionColumn.id,
        Setting.routes.selectOptionColumn.name,
        Setting.access_route.selectOptionColumn.access_type,
      ],
      Setting.access_route.tablename,
      [
        {
          table_name: Masters.master_access_type.tablename,
          primary: Masters.master_access_type.selectOptionColumn.accesscode,
          secondary: Setting.access_route.selectOptionColumn.access_id,
          join_condition: '=',
        },
        {
          table_name: Setting.routes.tablename,
          primary: Setting.routes.selectOptionColumn.id,
          secondary: Setting.access_route.selectOptionColumn.route_id,
          join_condition: '=',
        },
      ],
      [Setting.access_route.selectOptionColumn.access_id]
    )

    let select_sql = SelectStatement(select_access_route, [accessid])
    let routes = await Select(select_sql)

    if (routes.length > 0) {
      res.status(200).json(JsonResponseData(routes))
    } else {
      res.status(200).json(JsonResponseData(routes))
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.put('/update-access-route', async (req, res) => {
  try {
    const { access_route_id, access_type } = req.body

    console.log(access_route_id, access_type)

    let update_sql = UpdateStatementNoPrefix(
      Setting.access_route.tablename,
      [Setting.access_route.selectOptionColumn.access_type],
      [Setting.access_route.selectOptionColumn.id]
    )

    let result = await Update(update_sql, [access_type, access_route_id])
    console.log(result)

    res.status(200).json(JsonResponseSuccess())
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router

//#region Functions

//#endregion
