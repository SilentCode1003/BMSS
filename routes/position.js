const express = require('express')
const router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'position')
})

router.get('/load', async (req, res) => {
  try {
    const response = await SelectAll('master_position_type', 'mpt_')

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
    const positionname = req.body.positionname
    const createdby = req.session.fullname
    const status = dictionary.GetValue(dictionary.ACT())
    const createdate = helper.GetCurrentDatetime()

    if (!positionname || !createdby) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    let data = []

    const checkExisting = `SELECT * FROM master_position_type WHERE mpt_positionname = ?`
    const existing = await Check(checkExisting, [positionname])
    if (existing) {
      return res.json({
        msg: 'exist',
      })
    }

    const savePosition = `INSERT INTO master_position_type (mpt_positionname, mpt_status, mpt_createdby, mpt_createddate) VALUES (?, ?, ?, ?)`
    await Query(savePosition, [positionname, status, createdby, createdate])

    data.push([positionname, status, createdby, createdate])
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

router.post('/status', async (req, res) => {
  try {
    const positioncode = req.body.positioncode
    const status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    const data = [status, positioncode]

    if (!positioncode || !status) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const updatePosition = `UPDATE master_position_type SET mpt_status = ? WHERE mpt_positioncode = ?`
    await Query(updatePosition, data)

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${updatePosition}]`
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
    const { positionnamemodal, positioncode } = req.body
    const data = [positionnamemodal, positioncode]

    if (!positionnamemodal || !positioncode) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const checkExisting = `SELECT * FROM master_position_type WHERE mpt_positionname = ?`
    const existing = await Check(checkExisting, [positionnamemodal])
    if (existing) {
      return res.json({
        msg: 'duplicate',
      })
    }

    const updatePosition = `UPDATE master_position_type SET mpt_positionname = ? WHERE mpt_positioncode = ?`
    await Query(updatePosition, data)

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${updatePosition}]`
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
