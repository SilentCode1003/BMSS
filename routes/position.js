var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "position");
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from master_position_type`;

      mysql.Select(sql, 'MasterPositionType', (err, result) => {
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
      let positionname = req.body.positionname;
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = req.session.fullname;
      let createdate = helper.GetCurrentDatetime();
      let data = [];

      let sql_check = `select * from master_position_type where mpt_positionname='${positionname}'`;

      mysql.Select(sql_check, 'MasterPositionType', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
              data.push([
                  positionname,
                  status,
                  createdby,
                  createdate
              ])
      
              mysql.InsertTable('master_position_type', data, (err, result) => {
                  if (err) console.error('Error: ', err);
                  let loglevel = dictionary.INF();
                  let source = dictionary.MSTR();
                  let message = `${dictionary.GetValue(
                    dictionary.INSD()
                  )} -  [${data}]`;
                  let user = req.session.employeeid;
        
                  Logger(loglevel, source, message, user);
      
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
        let positioncode = req.body.positioncode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, positioncode];
        console.log(data);

        let sql_Update = `UPDATE master_position_type 
                       SET mpt_status = ?
                       WHERE mpt_positioncode = ?`;


        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
            if (err) console.error('Error: ', err);

            let loglevel = dictionary.INF();
            let source = dictionary.MSTR();
            let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
            let user = req.session.employeeid;

            Logger(loglevel, source, message, user);

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
        let positionnamemodal = req.body.positionnamemodal;
        let positioncode = req.body.positioncode;
        
        let data = [positionnamemodal, positioncode];
         
        let sql_Update = `UPDATE master_position_type 
                       SET mpt_positionname = ?
                       WHERE mpt_positioncode = ?`;
        
        let sql_check = `SELECT * FROM master_position_type WHERE mpt_positionname='${positionnamemodal}'`;


        mysql.Select(sql_check, 'MasterPositionType', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length == 1) {
                return res.json({
                    msg: 'duplicate'
                });
            } else {
                mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                    if (err) console.error('Error: ', err);

                    console.log(result);

                    let loglevel = dictionary.INF();
                    let source = dictionary.MSTR();
                    let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
                    let user = req.session.employeeid;

                    Logger(loglevel, source, message, user);

                    res.json({
                        msg: 'success',
                    });
                });
            }
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
});