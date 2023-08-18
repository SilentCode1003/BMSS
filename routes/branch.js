var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('branch',{
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
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

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

module.exports = router;

router.post('/save', (req, res) => {
  try {
      let branchid = req.body.branchid;
      let branchname = req.body.branchname;
      let tin = req.body.tin;
      let address = req.body.address;
      let logo = req.body.logo;
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = req.session.fullname;
      let createdate = helper.GetCurrentDatetime();
      let data = [];

      let sql_check = `select * from master_branch where mb_branchid='${branchid}'`;
      mysql.Select(sql_check, 'MasterBranch', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
              data.push([
                  branchid,
                  branchname,
                  tin,
                  address,
                  logo,
                  status,
                  createdby,
                  createdate
              ])
              mysql.InsertTable('master_branch', data, (err, result) => {
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
      let sql = `select * from master_branch`;

      mysql.Select(sql, 'MasterBranch', (err, result) => {
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
      let branchid = req.body.branchid;
      let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
      let data = [status, branchid];
      console.log('something');
      console.log(data);

      let sql_Update = `UPDATE master_branch 
                     SET mb_status = ?
                     WHERE mb_branchid = ?`;

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
