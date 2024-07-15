const express = require('express')
const router = express.Router()

const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'access')
})

router.get('/load', async (req, res) => {
  try {
    const response = await SelectAll('master_access_type', 'mat_')

    res.status(200).json({
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
    const accessname = req.body.accessname
    const createdby = req.session.fullname
    const status = dictionary.GetValue(dictionary.ACT())
    const createdate = helper.GetCurrentDatetime()

    if (!accessname || !createdby) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    let data = []

    const checkExisting = `SELECT * FROM master_access_type WHERE mat_accessname = ?`
    const existing = await Check(checkExisting, [accessname])
    if (existing) {
      return res.json({
        msg: 'exist',
      })
    }

    const saveAccess = `INSERT INTO master_access_type (mat_accessname, mat_status, mat_createdby, mat_createddate) VALUES (?, ?, ?, ?)`
    await Query(saveAccess, [accessname, status, createdby, createdate])

    data.push([accessname, status, createdby, createdate])
    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`
    const user = req.session.employeeid
    Logger(loglevel, source, message, user)

    res.status(200).json({
      msg: 'success',
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.put('/status', async (req, res) => {
  try {
    const accesscode = req.body.accesscode
    const status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())

    if (!accesscode || !status) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const update = `UPDATE master_access_type SET mat_status = ? WHERE mat_accesscode = ?`

    await Query(update, [status, accesscode])

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${update}]`
    const user = req.session.employeeid

    Logger(loglevel, source, message, user)

    res.status(200).json({
      msg: 'success',
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.put('/edit', async (req, res) => {
  try {
    const { accessnamemodal, accesscode } = req.body

    if (!accessnamemodal || !accesscode) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const data = [accessnamemodal, accesscode]
    const editAccess = `UPDATE master_access_type SET mat_accessname = ? WHERE mat_accesscode = ?`

    const checkExisting = `SELECT * FROM master_access_type WHERE mat_accessname= ?`
    const existing = await Check(checkExisting, [accessnamemodal])
    if (existing) {
      return res.json({
        msg: 'duplicate',
      })
    }

    await Query(editAccess, data)

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${editAccess}]`
    const user = req.session.employeeid

    Logger(loglevel, source, message, user)

    res.json({
      msg: 'success',
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

module.exports = router
