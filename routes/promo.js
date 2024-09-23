var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { error } = require('winston')
const { Validator } = require('./controller/middleware')
const verifyJWT = require('../middleware/authenticator')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'promo')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `select * from promo_details`

    mysql.Select(sql, 'PromoDetails', (err, result) => {
      if (err) console.error('Error: ' + err)

      //console.log(result);

      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({ msg: error })
  }
})

router.post('/save', (req, res) => {
  try {
    let promoname = req.body.promoname
    let description = req.body.description
    let dtipermit = req.body.dtipermit
    let condition = req.body.condition
    let startdate = req.body.startdate
    let enddate = req.body.enddate
    let status = dictionary.GetValue(dictionary.ACT())
    let createdby = req.session.fullname
    let createddate = helper.GetCurrentDatetime()
    let promo_details = []
    let sql_check = `select * from promo_details where not pd_status='INACTIVE'`

    promo_details.push([
      promoname,
      description,
      dtipermit,
      condition,
      startdate,
      enddate,
      status,
      createdby,
      createddate,
    ])

    console.log(promo_details)

    mysql.SelectResult(sql_check, (err, result) => {
      if (err) console.error('Error: ', err)

      //console.log(result);

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        mysql.InsertTable('promo_details', promo_details, (err, result) => {
          if (err) console.error('Error: ', err)

          //console.log(result);

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    res.json({ msg: error })
  }
})

router.post('/status', (req, res) => {
  try {
    let promoid = req.body.promoid
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    let data = [status, promoid]
    console.log(data)

    let sql_Update = `UPDATE promo_details 
                       SET pd_status = ?
                       WHERE pd_promoid = ?`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

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
    let promoname = req.body.promoname
    let promoid = req.body.promoid
    let description = req.body.description
    let permit = req.body.permit
    let condition = req.body.condition

    let data = []

    let sql_Update = `UPDATE promo_details SET`

    if (promoname) {
      sql_Update += ` pd_name = ?,`
      data.push(promoname)
    }

    if (description) {
      sql_Update += ` pd_description = ?,`
      data.push(description)
    }

    if (permit) {
      sql_Update += ` pd_dtipermit = ?,`
      data.push(permit)
    }

    if (condition) {
      sql_Update += ` pd_condition = ?,`
      data.push(condition)
    }

    sql_Update = sql_Update.slice(0, -1)
    sql_Update += ` WHERE pd_promoid = ?;`
    data.push(promoid)

    let sql_check = `SELECT * FROM promo_details WHERE pd_promoid = '${promoid}'`

    mysql.Select(sql_check, 'PromoDetails', (err, result) => {
      if (err) {
        console.error('Error: ', err)
        return res.json({
          msg: 'error',
        })
      }

      if (result.length !== 1) {
        return res.json({
          msg: 'notexist',
        })
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) {
            console.error('Error: ', err)
            return res.json({
              msg: 'error',
            })
          }
          //console.log(result);

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    res.json({
      msg: 'error',
    })
  }
})

router.post('/getactive', verifyJWT, (req, res) => {
  try {
    let currentdate = helper.GetCurrentDate()
    let status = dictionary.GetValue(dictionary.ACT())
    let sql = `select * from promo_details where '${currentdate}' between pd_startdate and pd_enddate and pd_status='${status}'`

    console.log(sql)

    mysql.Select(sql, 'PromoDetails', (err, result) => {
      if (err) console.error('Error: ', err)

      //console.log(result);

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
