var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const crypto = require('./repository/cryptography')
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', {
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
    employeeid: req.session.employeeid,
    branchid: req.session.branchid,
    usercode: req.session.usercode,
  })
})

module.exports = router

router.post('/authentication', (req, res) => {
  try {
    var username = req.body.username
    var password = req.body.password

    crypto.Encrypter(password, (err, encryptedpass) => {
      if (err) {
        console.error('Encryption Error: ', err)
      }

      let sql = `SELECT me_employeeid, me_fullname, master_position_type.mpt_positionname AS me_position,
        me_contactinfo, me_datehired, me_status, me_createdby, me_createddate, mu_usercode,
        mu_employeeid, master_access_type.mat_accessname AS mu_accesstype, mu_status, mu_username,
        mu_password, mu_branchid, mu_createdby, mu_createddate
      FROM master_employees
      INNER JOIN 
          master_user ON master_employees.me_employeeid = master_user.mu_employeeid
      LEFT JOIN 
          master_access_type ON master_user.mu_accesstype = master_access_type.mat_accesscode
      LEFT JOIN 
          master_position_type ON master_employees.me_position = master_position_type.mpt_positioncode
      WHERE mu_password='${encryptedpass}' AND mu_username='${username}'`

      mysql.SelectResult(sql, (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          })
        }
        ////console.log(result)
        if (result.length != 0 && result[0].mu_status == 'ACTIVE') {
          req.session.jwt = crypto.EncryptString(
            jwt.sign(JSON.stringify(result[0]), process.env._SECRET_KEY),
            {}
          )
          req.session.username = result[0].mu_username
          req.session.positiontype = result[0].me_position
          req.session.fullname = result[0].me_fullname
          req.session.accesstype = result[0].mu_accesstype
          req.session.employeeid = result[0].me_employeeid
          req.session.branchid = result[0].mu_branchid
          req.session.usercode = result[0].mu_usercode

          console.log(req.session.jwt)
          console.log(crypto.DecryptString(req.session.jwt))

          res.json({
            msg: 'success',
            data: result[0].mu_accesstype,
          }).next
        } else {
          return res.json({
            msg: 'incorrect',
          })
        }
      })
    })
  } catch (error) {
    res,
      json({
        msg: error,
      })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({
        msg: err,
      })
    }
    res.json({
      msg: 'success',
    })
  })
})

router.post('/poslogin', (req, res) => {
  try {
    var username = req.body.username
    var password = req.body.password

    crypto.Encrypter(password, (err, encryptedpass) => {
      if (err) {
        console.error('Encryption Error: ', err)
      }

      let sql = `SELECT * FROM master_employees inner join master_user on me_employeeid = mu_employeeid where mu_password='${encryptedpass}' and mu_username='${username}'`
      mysql.Select(sql, 'UserInfo', (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          })
        }
        //console.log(result)
        if (result.length != 0 && result[0].status == 'ACTIVE') {
          let data = []

          for (const d of JSON.parse(JSON.stringify([result[0]]))) {
            const {
              employeeid,
              fullname,
              position,
              contactinfo,
              datehired,
              usercode,
              accesstype,
              positiontype,
              status,
            } = d

            data.push({
              employeeid,
              fullname,
              position,
              contactinfo,
              datehired,
              usercode,
              accesstype,
              positiontype,
              status,
              APK: crypto.EncryptString(
                jwt.sign(
                  JSON.stringify({
                    employeeid,
                    fullname,
                    position,
                    contactinfo,
                    datehired,
                    usercode,
                    accesstype,
                    positiontype,
                    status,
                  }),
                  process.env._SECRET_KEY
                )
              ),
            })
          }

          res.json({
            msg: 'success',
            data: data,
          })
        } else {
          return res.json({
            msg: 'incorrect',
          })
        }
      })
    })
  } catch (error) {
    res,
      json({
        msg: error,
      })
  }
})
