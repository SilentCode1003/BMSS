var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('cashreports',{
    positiontype: req.session.positiontype,
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

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

router.post('/save', (req, res) => {
try {
    let reportid = req.body.reportid;
    let date = req.body.date;
    let shift = req.body.shift;
    let pos = req.body.pos;
    let cashier = req.body.cashier;
    let type = req.body.type;
    let status = req.body.status;
    let data = [];

    let sql_check = `select * from cash_report where cr_report_id='${reportid}'`;
    mysql.Select(sql_check, 'CashReport', (err, result) => {
        if (err) console.error('Error: ', err);

        if (result.length != 0) {
            return res.json({
            msg: 'exist'
            })
        }else {
            data.push([
                reportid,
                date,
                shift,
                pos,
                cashier,
                type,
                status,
            ])
            mysql.InsertTable('cash_report', data, (err, result) => {
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
    let sql = `select * from cash_report`;

    mysql.Select(sql, 'CashReport', (err, result) => {
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
