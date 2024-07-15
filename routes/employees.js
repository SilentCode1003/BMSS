const express = require('express')
const router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'employees')
  const currentDate = new Date().toISOString().split('T')[0]
})

router.get('/load', async (req, res) => {
  try {
    const selectEmployees = `SELECT me_employeeid AS me_employeeid, me_fullname AS me_fullname, mpt_positionname AS me_position, me_contactinfo AS me_contactinfo, me_datehired AS me_datehired, me_status AS me_status, me_createdby AS me_createdby, me_createddate AS me_createddate
    FROM master_employees 
    INNER JOIN master_position_type ON me_position = mpt_positioncode
    ORDER BY me_employeeid ASC;`

    const response = await Query(selectEmployees, [], 'me_')

    res.json({
      msg: 'success',
      data: response,
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.post('/save', async (req, res) => {
  try {
    const { fullname, positionname, contactinfo, datehired } = req.body
    const createdby = req.session.fullname
    const status = dictionary.GetValue(dictionary.ACT())
    const createdate = helper.GetCurrentDatetime()

    let data = []

    if (!fullname || !positionname || !contactinfo || !datehired) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const checkExisting = `SELECT * FROM master_employees WHERE me_fullname = ?`
    const existing = await Check(checkExisting, [fullname])
    if (existing) {
      return res.json({
        msg: 'exist',
      })
    }

    const saveEmployee = `INSERT INTO master_employees (me_fullname, me_position, me_contactinfo, me_datehired, me_status, me_createdby, me_createddate) VALUES (?, ?, ?, ?, ?, ?, ?)`
    await Query(saveEmployee, [
      fullname,
      positionname,
      contactinfo,
      datehired,
      status,
      createdby,
      createdate,
    ])

    data.push([fullname, positionname, contactinfo, datehired, status, createdby, createdate])

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`
    const user = req.session.employeeid

    Logger(loglevel, source, message, user)

    res.json({
      msg: 'success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.post('/status', async (req, res) => {
  try {
    const employeeid = req.body.employeeid
    const status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())

    if (!employeeid || !status) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const data = [status, employeeid]

    const updateStatus = `UPDATE master_employees SET me_status = ? WHERE me_employeeid = ?`
    await Query(updateStatus, data)

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${updateStatus}]`
    const user = req.session.employeeid

    Logger(loglevel, source, message, user)

    res.json({
      msg: 'success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.post('/delete', async (req, res) => {
  try {
    const employeeid = req.body.employeeid
    if (!employeeid) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    let queries = []

    const status = 'DELETED'
    const data = [status, employeeid]

    const updateEmployee = `UPDATE master_employees SET me_status = ? WHERE me_employeeid = ?`
    const updateUser = `UPDATE master_user SET mu_status = ? WHERE mu_employeeid = ?`

    queries.push({
      sql: updateEmployee,
      values: data,
    })

    queries.push({
      sql: updateUser,
      values: data,
    })

    await Transaction(queries)

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${updateEmployee}]`
    const user = req.session.employeeid

    Logger(loglevel, source, message, user)

    res.json({
      msg: 'success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.post('/edit', async (req, res) => {
  try {
    const { employeeid, positionname, contactinfo, fullname } = req.body

    let data = []
    let updateEmployee = `UPDATE master_employees SET`

    if (positionname) {
      updateEmployee += ` me_position = ?,`
      data.push(positionname)
    }

    if (contactinfo) {
      updateEmployee += ` me_contactinfo = ?,`
      data.push(contactinfo)
    }

    if (fullname) {
      updateEmployee += ` me_fullname = ?,`
      data.push(fullname)
    }

    updateEmployee = updateEmployee.slice(0, -1)
    updateEmployee += ` WHERE me_employeeid = ?;`
    data.push(employeeid)

    let checkExisting = `SELECT * FROM master_employees WHERE me_employeeid= ?`
    const existing = await Check(checkExisting, [employeeid])
    if (!existing) {
      return res.json({
        msg: 'notexist',
      })
    }

    await Query(updateEmployee, data)

    res.status(200).json({
      msg: 'success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

// router.get('/getactive', (req, res) => {
//   try {
//     let status = dictionary.GetValue(dictionary.ACT())
//     let sql = `select * from master_employees where me_status='${status}'`

//     mysql.Select(sql, 'MasterEmployees', (err, result) => {
//       if (err) console.error('Error: ', err)

//       res.json({
//         msg: 'success',
//         data: result,
//       })
//     })
//   } catch (error) {
//     res.json({
//       msg: error,
//     })
//   }
// })

module.exports = router
