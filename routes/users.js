var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
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
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = "Ralph Lauren Santos";
      let createdate = helper.GetCurrentDatetime();
      let data = [];

      let sql_check = `select * from master_user where mu_employeeid='${employeeid}'`;

      mysql.Select(sql_check, 'MasterUser', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
              data.push([
                  employeeid,
                  accessname,
                  positionname,
                  status,
                  createdby,
                  createdate
              ])
      
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