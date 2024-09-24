var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const crypto = require('./repository/cryptography')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'users')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT mu_usercode AS mu_usercode, me_fullname AS mu_employeeid, mat_accessname AS mu_accesstype, 
      mu_username AS mu_username, mu_password AS mu_password, mb_branchname AS mu_branchid, mu_status AS mu_status, 
      mu_createdby AS mu_createdby, mu_createddate AS mu_createddate 
      FROM master_user 
      INNER JOIN master_access_type ON mu_accesstype = mat_accesscode
      INNER JOIN master_employees on mu_employeeid = me_employeeid
      INNER JOIN master_branch on mu_branchid = mb_branchid`

    mysql.Select(sql, 'MasterUser', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      console.log(helper.GetCurrentDatetime())

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
    let employeeid = req.body.employeeid
    let accessname = req.body.accessname
    let username = req.body.username
    let password = req.body.password
    let branchid = req.body.branchid
    let status = dictionary.GetValue(dictionary.ACT())
    let createdby = req.session.fullname == null ? 'Creator' : req.session.fullname
    let createdate = helper.GetCurrentDatetime()
    let data = []
    let dataAccess = []

    //#region Access
    //   let check_access_name = `select * from master_access_type where mat_accessname='${accessname}'`;

    //   mysql.Select(check_access_name, 'MasterAccessType', (err, result) => {
    //       if (err) console.error('Error: ', err);

    //       if (result.length != 0) {
    //       }else {
    //             dataAccess.push([
    //                 accessname,
    //                 status,
    //                 createdby,
    //                 createdate
    //             ])

    //             mysql.InsertTable('master_access_type', dataAccess, (err, result) => {
    //                 if (err) console.error('Error: ', err);
    //                 let loglevel = dictionary.INF();
    //                 let source = dictionary.MSTR();
    //                 let message = `${dictionary.GetValue(
    //                   dictionary.INSD()
    //                 )} -  [${dataAccess}]`;
    //                 let user = req.session.employeeid;

    //                 Logger(loglevel, source, message, user);
    //             })
    //       }
    //   })
    //#endregion Access

    let sql_check = `select * from master_user where mu_employeeid='${employeeid}'`

    mysql.Select(sql_check, 'MasterUser', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        crypto.Encrypter(password, (err, encryptedpass) => {
          if (err) console.error('error: ', err)
          data.push([
            employeeid,
            accessname,
            username,
            encryptedpass,
            branchid,
            status,
            createdby,
            createdate,
          ])
        })

        mysql.InsertTable('master_user', data, (err, result) => {
          if (err) console.error('Error: ', err)

          //console.log(result);
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

router.put('/status', (req, res) => {
  try {
    let usercode = req.body.usercode
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    let data = [status, usercode]
    console.log(data)

    let sql_Update = `UPDATE master_user 
                       SET mu_status = ?
                       WHERE mu_usercode = ?`

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
    let currentpassword = req.body.currentpassword
    let newpassword = req.body.newpassword
    let usercode = req.body.usercode

    console.log(currentpassword, newpassword, usercode)

    crypto.Encrypter(currentpassword, (err, encryptedpass) => {
      if (err) {
        console.error('Encryption Error: ', err)
      }
      crypto.Encrypter(newpassword, (err, newencryptedpass) => {
        if (err) {
          console.error('Encryption Error: ', err)
        }

        data = [newencryptedpass, usercode]

        let sql_Update = `UPDATE master_user 
                       SET mu_password = ?
                       WHERE mu_usercode = ?`

        let sql_check = `SELECT * FROM master_user WHERE mu_password='${encryptedpass}'`

        mysql.Select(sql_check, 'MasterUser', (err, result) => {
          if (err) console.error('Error: ', err)

          if (result.length != 1) {
            return res.json({
              msg: 'notmatch',
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
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
