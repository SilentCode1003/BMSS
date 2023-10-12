var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const crypto = require('./repository/cryptography');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users',{
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
    employeeid: req.session.employeeid,
    branchid: req.session.branchid,
  });
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from master_user`;

      mysql.Select(sql, 'MasterUser', (err, result) => {
          if (err) {
              return res.json({
                  msg: err
              })
          }

          console.log(helper.GetCurrentDatetime());

          res.json({
              msg: 'success',
              data: result
          })
      });
  } catch (error) {
      res.json({
          msg: error
      })
  }
})

router.post('/save', (req, res) => {
  try {
      let employeeid = req.body.employeeid;
      let accessname = req.body.accessname;
      let positionname = req.body.positionname;
      let username = req.body.username;
      let password = req.body.password;
      let branchid = req.body.branchid;
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = req.session.fullname;
      let createdate = helper.GetCurrentDatetime();
      let data = [];
      let dataposition = [];
      let dataAccess = [];

      //#region Position
      let check_position_name = `select * from master_position_type where mpt_positionname='${positionname}'`;
      mysql.Select(check_position_name, "MasterPositionType", (err, result) => {
          if (err) console.error("Error: ", err);
  
          if (result.length != 0) {
          } else {
                dataposition.push([
                    positionname, 
                    status, 
                    createdby, 
                    createdate
                ]);
      
                mysql.InsertTable("master_position_type", dataposition, (err, result) => {
                  if (err) console.error("Error: ", err);
                });
          }
      });
      //#endregion Position

      //#region Access
      let check_access_name = `select * from master_access_type where mat_accessname='${accessname}'`;

      mysql.Select(check_access_name, 'MasterAccessType', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
          }else {
                dataAccess.push([
                    accessname,
                    status,
                    createdby,
                    createdate
                ])
        
                mysql.InsertTable('master_access_type', dataAccess, (err, result) => {
                    if (err) console.error('Error: ', err);
                })
          }
      })
      //#endregion Access

      let sql_check = `select * from master_user where mu_employeeid='${employeeid}'`;

      mysql.Select(sql_check, 'MasterUser', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
            crypto.Encrypter(password, (err, encryptedpass)=>{
                if(err)console.error('error: ', err);
                data.push([
                    employeeid,
                    accessname,
                    positionname,
                    username,
                    encryptedpass,
                    branchid,
                    status,
                    createdby,
                    createdate
                ])
            })

              mysql.InsertTable('master_user', data, (err, result) => {
                  if (err) console.error('Error: ', err);
      
                  console.log(result);
      
                  res.json({
                      msg: 'success',
                  })
              })
          }
      })
  }catch (error) {
      res.json({
          msg: error
      })
  }
})

router.post('/status', (req, res) => {
    try {
        let usercode = req.body.usercode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, usercode];
        console.log(data);

        let sql_Update = `UPDATE master_user 
                       SET mu_status = ?
                       WHERE mu_usercode = ?`;


        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
            if (err) console.error('Error: ', err);

            res.json({
                msg: 'success',
            });
        });
        
    } catch (error) {
        res.json({
            msg: error
        });
    }
});

router.post('/edit', (req, res) => {
    try {
        let currentpassword = req.body.currentpassword;
        let newpassword = req.body.newpassword;
        let usercode = req.body.usercode;

        crypto.Encrypter(currentpassword, (err, encryptedpass) => {
            if (err) {
                console.error('Encryption Error: ', err);
            }
            crypto.Encrypter(newpassword, (err, newencryptedpass) => {
                if (err) {
                    console.error('Encryption Error: ', err);
                }

                data = [newencryptedpass, usercode]

                let sql_Update = `UPDATE master_user 
                       SET mu_password = ?
                       WHERE mu_usercode = ?`;
        
                let sql_check = `SELECT * FROM master_user WHERE mu_password='${encryptedpass}'`;


                mysql.Select(sql_check, 'MasterUser', (err, result) => {
                    if (err) console.error('Error: ', err);

                    if (result.length != 1) {
                        return res.json({
                            msg: 'notmatch'
                        });
                    } else {
                        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                            if (err) console.error('Error: ', err);

                            console.log(result);

                            res.json({
                                msg: 'success',
                            });
                        });
                    }
                });
            });
        });
        
    } catch (error) {
        res.json({
            msg: error
        });
    }
});