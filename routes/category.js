var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const verifyJWT = require('../middleware/authenticator')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'category')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `select * from master_category`

    mysql.Select(sql, 'MasterCategory', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      // console.log("Data Category: ", result);

      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/save', (req, res) => {
  try {
    let categoryname = req.body.categoryname
    let status = dictionary.GetValue(dictionary.ACT())
    let createdby = req.session.fullname
    let createddate = helper.GetCurrentDatetime()
    let data = []

    let sql_check = `select * from master_category where mc_categoryname='${categoryname}'`

    mysql.Select(sql_check, 'MasterCategory', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        data.push([categoryname, status, createdby, createddate])

        mysql.InsertTable('master_category', data, (err, result) => {
          if (err) console.error('Error: ', err)

          ////console.log(result[0]['id'])

          let loglevel = dictionary.INF()
          let source = dictionary.MSTR()
          let message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`
          let user = req.session.employeeid

          Logger(loglevel, source, message, user)

          res.json({
            msg: 'success',
          })
        })
      }
    })
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

router.post('/edit', (req, res) => {
  try {
    let categoryname = req.body.categoryname
    let categorycode = req.body.categorycode

    let data = [categoryname, categorycode]
    // //console.log(data);
    let sql_Update = `UPDATE master_category 
                       SET mc_categoryname = ?
                       WHERE mc_categorycode = ?`

    let sql_check = `SELECT * FROM master_category WHERE mc_categoryname='${categoryname}'`

    mysql.Select(sql_check, 'MasterCategory', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length == 1) {
        return res.json({
          msg: 'duplicate',
        })
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error('Error: ', err)

          //console.log(result);

          let loglevel = dictionary.INF()
          let source = dictionary.MSTR()
          let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`
          let user = req.session.employeeid

          Logger(loglevel, source, message, user)

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/active', verifyJWT, (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT())
    let sql = `select * from master_category where mc_status='${status}'`

    mysql.Select(sql, 'MasterCategory', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      //console.log(helper.GetCurrentDatetime())

      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
