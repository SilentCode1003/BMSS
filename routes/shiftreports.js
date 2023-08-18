var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
    res.render('shiftreports',{
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
module.exports = router;

router.get('/load', (req, res) => {
    try {
        let sql = `select * from shift_report`;
  
        mysql.Select(sql, 'ShiftReport', (err, result) => {
            if (err) {
                return res.json({
                    msg: err
                })
            }
  
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
        let date = req.body.date;
        let pos = req.body.pos;
        let shift = req.body.shift;
        let cashier = req.body.cashier;
        let floating = req.body.floating;
        let cashfloat = req.body.cashfloat;
        let salesbeginning = req.body.salesbeginning;
        let salesending = req.body.salesending;
        let totalsales = req.body.totalsales;
        let receiptbeginning = req.body.receiptbeginning;
        let receiptending = req.body.receiptending;
        let status = req.body.pos;
        let approvedby = req.body.approvedby;
        let approveddate = req.body.approveddate;
        let data = [];
  
        let sql_check = `select * from shift_report where mp_date='${productid}'`;
  
        mysql.Select(sql_check, 'ShiftReport', (err, result) => {
            if (err) console.error('Error: ', err);
  
            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    date,
                    pos,
                    shift,
                    cashier,
                    floating,
                    cashfloat,
                    salesbeginning,
                    salesending,
                    totalsales,
                    receiptbeginning,
                    receiptending,
                    productid,
                    description,
                    productimage,
                    status,
                    approvedby,
                    approveddate
                ])
        
                mysql.InsertTable('shift_report', data, (err, result) => {
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