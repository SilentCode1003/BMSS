var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const { DataModeling } = require('./model/bmssmodel')
const verifyJWT = require('../middleware/authenticator')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'addon')
})
module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `select 
    a_id,
    a_name,
    at_name as a_type,
    a_price,
    a_isproduct,
    a_status,
    a_createdby,
    a_createddate 
    from addon
    inner join addon_type on a_type = at_id`

    mysql.Selects(sql, (err, result) => {
      if (err) {
        console.error(err)
        return res.json({ msg: err })
      }

      if (result.length != 0) {
        let data = DataModeling(result, 'a_')
        res.json({ msg: 'success', data: data })
      } else {
        res.json({
          msg: 'success',
          data: result,
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/save', (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT())
    let createdby = req.session.fullname == null ? 'DEV42' : req.session.fullname
    let createddate = helper.GetCurrentDatetime()
    const { name, price, type } = req.body
    let isproduct = type == 'SERVICE' ? 0 : 1

    let sql = helper.InsertStatement('addon', 'a', [
      'name',
      'type',
      'price',
      'isproduct',
      'status',
      'createdby',
      'createddate',
    ])
    let data = [[name, type, price, isproduct, status, createdby, createddate]]
    let checkStatement = helper.SelectStatement(
      `select * from addon where a_name = ? and a_type = ? and a_price = ? and a_isproduct = ?`,
      [name, type, price, isproduct]
    )

    Check(checkStatement)
      .then((result) => {
        //console.log(result);
        if (result != 0) {
          return res.json({
            msg: 'exist',
          })
        } else {
          mysql.Insert(sql, data, (err, result) => {
            if (err) {
              console.log(err)
              res.json({ msg: err })
            }

            //console.log(result);

            res.json({ msg: 'success' })
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.json({ msg: error })
      })
  } catch (error) {
    console.log(error)
    res.json({ msg: error })
  }
})

router.put('/status', (req, res) => {
  try {
    let id = req.body.id
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    let data = [status, id]

    let updateStatement = helper.UpdateStatement('addon', 'a', ['status'], ['id'])

    mysql.UpdateMultiple(updateStatement, data, (err, result) => {
      if (err) console.error('Error: ', err)

      res.json({ msg: 'success' })
    })
  } catch (error) {
    console.log(error)
    res.json({ msg: error })
  }
})

router.put('/edit', (req, res) => {
  try {
    const { name, price, type, id } = req.body

    //console.log(name, price, type, id)

    let data = []
    let columns = []
    let arguments = []

    if (name) {
      data.push(name)
      columns.push('name')
    }

    if (price) {
      data.push(price)
      columns.push('price')
    }

    if (type) {
      data.push(type)
      columns.push('type')
    }

    if (id) {
      data.push(id)
      arguments.push('id')
    }

    let updateStatement = helper.UpdateStatement('addon', 'a', columns, arguments)

    let checkStatement = helper.SelectStatement(
      `select * from addon where a_name = ? and a_price = ? and a_type = ?`,
      [name, price]
    )

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json({ msg: 'exist' })
        } else {
          mysql.UpdateMultiple(updateStatement, data, (err, result) => {
            if (err) console.error('Error: ', err)

            //console.log(result);

            res.json({
              msg: 'success',
            })
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.json({ msg: error })
      })
  } catch (error) {
    console.log(error)
    res.json({ msg: error })
  }
})

router.post('/getactive',verifyJWT, (req, res) => {
  try {
    let status = req.body.status

    let sql = `select 
    a_id,
    a_name,
    at_name as a_type,
    a_price,
    a_isproduct,
    a_status,
    a_createdby,
    a_createddate 
    from addon
    inner join addon_type on a_type = at_id where a_status = '${status}'`

    mysql.Selects(sql, (err, result) => {
      if (err) {
        console.log(err)
        res.json({ msg: err })
      }
      if (result != 0) {
        let data = DataModeling(result, 'a_')
        res.json({ msg: 'success', data: data })
      } else {
        res.json({ msg: 'success', data: result })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

//#region FUNCTION
function Check(sql) {
  return new Promise((resolve, reject) => {
    mysql.Selects(sql, (err, result) => {
      if (err) reject(err)

      resolve(result)
    })
  })
}
//#endregion
