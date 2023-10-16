var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function (req, res, next) {
    res.render('inventoryvaluationreport', {
        positiontype: req.session.positiontype,
        accesstype: req.session.accesstype,
        username: req.session.username,
        fullname: req.session.fullname,
        employeeid: req.session.employeeid,
        branchid: req.session.branchid,
    });
});

function isAuthUser(req, res, next) {

    if (req.session.positiontype == "User" || req.session.positiontype == "Admin" || req.session.positiontype == "Developer") {
        next();
    }
    else {
        res.redirect('/login');
    }
};
module.exports = router;


router.get('/load', (req, res) => {
    try {
        let sql = `SELECT * FROM inventory_valuation_report`;

        mysql.Select(sql, 'InventoryValuationReport', (err, result) => {
            if (err) {
                console.log(err)
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


