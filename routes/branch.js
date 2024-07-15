const express = require('express')
const router = express.Router()
const { Validator } = require('./controller/middleware')

const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'branch')
})

router.get('/load', async (req, res) => {
  try {
    const response = await SelectAll('master_branch', 'mb_')

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
    const { branchid, branchname, tin, address, logo } = req.body

    if (!branchid || !branchname || !tin || !address || !logo) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const status = dictionary.GetValue(dictionary.ACT())
    const createdby = req.session.fullname
    const createdate = helper.GetCurrentDatetime()

    let data = []

    const checkExisting = `SELECT * FROM master_branch WHERE mb_branchid= ?`
    const existing = await Check(checkExisting, [branchid])
    if (existing) {
      return res.json({
        msg: 'exist',
      })
    }

    const saveBranch = `INSERT INTO master_branch (mb_branchid, mb_branchname, mb_tin, mb_address, mb_logo, mb_status, mb_createdby, mb_createddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    await Query(saveBranch, [
      branchid,
      branchname,
      tin,
      address,
      logo,
      status,
      createdby,
      createdate,
    ])

    data.push([branchid, branchname, tin, address, logo, status, createdby, createdate])

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.INSD())} -  [Branch: ${branchid}]`
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
    const branchid = req.body.branchid
    const status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())

    if (!branchid || !status) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const data = [status, branchid]

    const updateStatus = `UPDATE master_branch SET mb_status = ? WHERE mb_branchid = ?`
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

router.post('/edit', async (req, res) => {
  try {
    const { branchid, branchname, tin, address, logo } = req.body

    let data = []
    let branchUpdate = `UPDATE master_branch SET`

    if (branchname) {
      branchUpdate += ` mb_branchname = ?,`
      data.push(branchname)
    }

    if (tin) {
      branchUpdate += ` mb_tin = ?,`
      data.push(tin)
    }

    if (address) {
      branchUpdate += ` mb_address = ?,`
      data.push(address)
    }

    if (logo) {
      branchUpdate += ` mb_logo = ?,`
      data.push(logo)
    }

    branchUpdate = branchUpdate.slice(0, -1)
    branchUpdate += ` WHERE mb_branchid = ?;`
    data.push(branchid)

    const checkExisting = `SELECT * FROM master_branch WHERE mb_branchid= ?`
    const existing = await Check(checkExisting, [branchid])
    if (!existing) {
      return res.json({
        msg: 'notexist',
      })
    }

    await Query(branchUpdate, data)

    const loglevel = dictionary.INF()
    const source = dictionary.MSTR()
    const message = `${dictionary.GetValue(dictionary.UPDT())} -  [${branchUpdate}]`
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

router.post('/getbranch', async (req, res) => {
  try {
    const { branchid } = req.body

    if (!branchid) {
      return res.json({
        msg: 'All fields are required',
      })
    }

    const selectBranch = `SELECT * FROM master_branch WHERE mb_branchid= ?`
    const response = await Query(selectBranch, [branchid], 'mb_')

    if (response.length === 0) {
      return res.json({
        msg: 'notexist',
      })
    }

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

module.exports = router
