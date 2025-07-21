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
  UpdateStatementNoPrefix,
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
const { Customer } = require('../repository/model/customer')

router.get('/', function (req, res, next) {
  Validator(req, res, 'customer')
})

router.get('/get-customer', async (req, res) => {
  try {
    let sql = SelectAllStatement(
      Customer.customer_info.tablename,
      Customer.customer_info.selectColumns
    )

    console.log(sql)

    let result = await Select(sql)
    res.status(200).json(JsonResponseData(DataModeling(result, Customer.customer_info.prefix_)))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/add-customer', async (req, res) => {
  try {
    const { type, company, fullname, email, phone, mobile, address, create_at, create_by } =
      req.body
    let sql = InsertStatement(
      Customer.customer_info.tablename,
      Customer.customer_info.prefix,
      Customer.customer_info.insertColumns
    )

    let data = [[type, company, fullname, email, phone, mobile, address, create_at, create_by]]

    let result = await Insert(sql, data)
    res.status(200).json(JsonResponseData(result))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.put('/edit-customer', async (req, res) => {
  try {
    const { id, type, company, fullname, email, phone, mobile, address, create_at, create_by } =
      req.body
    let sql = UpdateStatementNoPrefix(
      Customer.customer_info.tablename,
      [
        Customer.customer_info.selectOptionsColumns.type,
        Customer.customer_info.selectOptionsColumns.company,
        Customer.customer_info.selectOptionsColumns.fullname,
        Customer.customer_info.selectOptionsColumns.email,
        Customer.customer_info.selectOptionsColumns.phone,
        Customer.customer_info.selectOptionsColumns.mobile,
        Customer.customer_info.selectOptionsColumns.address,
      ],
      [Customer.customer_info.selectOptionsColumns.id]
    )

    let data = [type, company, fullname, email, phone, mobile, address, id]
    let result = await Update(sql, data)

    res.status(200).json(JsonResponseData(result))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.delete('/delete-customer', async (req, res) => {
  try {
    const { id } = req.body
    let sql = DeleteStatement(Customer.customer_info.tablename, [
      Customer.customer_info.selectOptionsColumns.id,
    ])

    let data = [id]

    let result = await Delete(sql, data)
    res.status(200).json(JsonResponseData(result))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/get-customer-transaction', async (req, res) => {
  try {
    let sql = SelectAllStatement(
      Customer.customer_transaction.tablename,
      Customer.customer_transaction.selectColumns
    )

    console.log(sql)

    let result = await Select(sql)
    res
      .status(200)
      .json(JsonResponseData(DataModeling(result, Customer.customer_transaction.prefix_)))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/add-customer-transaction', async (req, res) => {
  try {
    const { customer_id, sales_id, status } = req.body
    const create_at = GetCurrentDatetime()

    let sql = InsertStatement(
      Customer.customer_transaction.tablename,
      Customer.customer_transaction.prefix,
      Customer.customer_transaction.insertColumns
    )

    let data = [[customer_id, sales_id, status, create_at]]

    let result = await Insert(sql, data)
    res.status(200).json(JsonResponseData(result))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router
