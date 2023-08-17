var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('position',{
    fullname: req.session.fullname,
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
  });
});

function isAuthUser(req, res, next) {

  if (req.session.positiontype == "User" || req.session.positiontype == "Admin" || req.session.positiontype == "Developer" ) {
      next();
  }
  else {
      res.redirect('/login');
  }
};

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
      let createdby = "Ralph Lauren Santos";
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