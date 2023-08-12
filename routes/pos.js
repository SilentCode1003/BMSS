var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pos');
});

module.exports = router;

router.post('/save', (req, res) => {
  try {
      let posid = req.body.posid;
      let posname = req.body.posname;
      let serial = req.body.serial;
      let min = req.body.min;
      let ptu = req.body.ptu;
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = "Ralph Lauren Santos";
      let createdate = helper.GetCurrentDatetime();
      let data = [];

      let sql_check = `select * from master_pos where mp_posid='${posid}'`;

      mysql.Select(sql_check, 'MasterPos', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
              data.push([
                    posid,
                    posname,
                    serial,
                    min,
                    ptu,
                    status,
                    createdby,
                    createdate
              ])
      
              mysql.InsertTable('master_pos', data, (err, result) => {
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

router.get('/load', (req, res) => {
  try {
      let sql = `select * from master_pos`;

      mysql.Select(sql, 'MasterPos', (err, result) => {
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

router.post('/status', (req, res) => {
  try {
      let posid = req.body.posid;
      let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
      let data = [status, posid];
      console.log('something');
      console.log(data);

      let sql_Update = `UPDATE master_pos 
                     SET mp_status = ?
                     WHERE mp_posid = ?`;

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
