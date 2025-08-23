var express = require('express')
var router = express.Router()

const { UpdateStatement, UpdateStatementNoPrefix } = require('../repository/helper/customhelper')
const dictionary = require('../repository/helper/dictionary')
const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const verifyJWT = require('../repository/middleware/authenticator')
const { Check, Query, SelectAll } = require('../repository/utility/query.util')
const { SelectStatement, InsertStatement } = require('../repository/helper/customhelper')
const {
  JsonResponseExist,
  JsonResponseSuccess,
  JsonResponseData,
  JsonResponseError,
} = require('../repository/helper/response')
const { Masters } = require('../repository/model/masters')
const { Select, Selects } = require('../repository/helper/bmssdb')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'category')
})

module.exports = router

router.get('/load', async (req, res) => {
  try {
    let categoryResult = await SelectAll(
      Masters.master_category.tablename,
      Masters.master_category.prefix_
    )

    res.status(200).json(JsonResponseData(categoryResult))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/save', async (req, res) => {
  try {
    const { categoryname, is_enabled } = req.body
    let status = dictionary.GetValue(dictionary.ACT())
    let createdby = req.session.fullname
    let createddate = helper.GetCurrentDatetime()
    let is_display = is_enabled == 'true' ? 1 : 0
    let data = []

    console.log(is_enabled)

    let sql_check = SelectStatement('select * from master_category where mc_categoryname=?', [
      categoryname,
    ])

    let checkResult = await Check(sql_check)

    //Blocked existing category
    if (checkResult) {
      return res.status(400).json(JsonResponseExist())
    }

    data.push([categoryname, status, createdby, createddate, is_display])

    console.log(data)

    let insert_sql = InsertStatement(
      Masters.master_category.tablename,
      Masters.master_category.prefix,
      Masters.master_category.insertColumns
    )

    mysql.Insert(insert_sql, data, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        return res.status(500).json(JsonResponseError(err))
      }
      let loglevel = dictionary.INF()
      let source = dictionary.MSTR()
      let message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`
      let user = req.session.employeeid

      Logger(loglevel, source, message, user)

      res.status(200).json(JsonResponseSuccess())
    })

    // Query(insert_sql, data, (err, result) => {
    //   if (err) {
    //     console.error('Error: ', err)
    //     return res.status(500).json(JsonResponseError(err))
    //   }
    //   let loglevel = dictionary.INF()
    //   let source = dictionary.MSTR()
    //   let message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`
    //   let user = req.session.employeeid

    //   Logger(loglevel, source, message, user)

    //   res.status(200).json({
    //     msg: 'success',
    //   })
    // })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/status', (req, res) => {
  try {
    let categorycode = req.body.categorycode
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    let data = [status, categorycode]
    // //console.log(data);

    let sql_Update = `UPDATE master_category 
                       SET mc_status = ?
                       WHERE mc_categorycode = ?`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      let loglevel = dictionary.INF()
      let source = dictionary.MSTR()
      let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`
      let user = req.session.employeeid

      Logger(loglevel, source, message, user)

      res.json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.put('/edit', async (req, res) => {
  try {
    const { categorycode, categoryname, is_enabled } = req.body
    let isShow = is_enabled == 'true' ? 1 : 0
    let data = []
    let Columns = []

    let select_sql = SelectStatement('SELECT * FROM master_category WHERE mc_categoryname = ?', [
      categoryname,
    ])
    let check_sql = await Check(select_sql)

    if (check_sql) {
      return res.json(JsonResponseExist())
    }

    if (categoryname) {
      data.push(categoryname)
      Columns.push(Masters.master_category.selectOptionColumn.categoryname)
    }

    if (isShow) {
      data.push(isShow)
      Columns.push(Masters.master_category.selectOptionColumn.is_display)
    }

    let update_sql = UpdateStatementNoPrefix(Masters.master_category.tablename, Columns, [
      Masters.master_category.selectOptionColumn.categorycode,
    ])

    data.push(categorycode)

    let updateResult = await Query(update_sql, data)
    console.log(updateResult)

    let loglevel = dictionary.INF()
    let source = dictionary.MSTR()
    let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`
    let user = req.session.employeeid

    Logger(loglevel, source, message, user)

    res.status(200).json(JsonResponseSuccess())
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.get('/active', (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT())
    let select_sql = SelectStatement('select * from master_category where mc_status=?', [status])

    Selects(select_sql, (err, result) => {
      if (err) throw err
      res.status(200).json(JsonResponseData(result))
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})
