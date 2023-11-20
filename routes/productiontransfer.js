var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
    res.render("productiontransfer", {
        positiontype: req.session.positiontype,
        accesstype: req.session.accesstype,
        username: req.session.username,
        fullname: req.session.fullname,
        employeeid: req.session.employeeid,
        branchid: req.session.branchid,
    });
});

function isAuthUser(req, res, next) {
    if (
        req.session.positiontype == "User" ||
        req.session.positiontype == "Admin" ||
        req.session.positiontype == "Developer"
    ) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;


router.get('/load', (req, res) => {
    try {
        let sql = `select * from production_transfer`;

        mysql.Select(sql, 'ProductionTransfer', (err, result) => {
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
        let productid = req.body.productid;
        let branchid = req.body.branchid;
        let quantity = req.body.quantity;
        let status = dictionary.GetValue(dictionary.PND());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let data = [];

        data.push([
            productid,
            quantity,
            branchid,
            status,
            createdby,
            createdate
        ])

        mysql.InsertTable('production_transfer', data, (err, result) => {
            if (err) console.error('Error: ', err);

            console.log(result);

            res.json({
                msg: 'success',
            })
        })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post("/cancel", (req, res) => {
    try {
        let transferid = req.body.transferid;
        let status =
            req.body.status == dictionary.GetValue(dictionary.PND())
                ? dictionary.GetValue(dictionary.CND())
                : dictionary.GetValue(dictionary.PND());
        let data = [status, transferid];
        console.log(data);

        let sql_Update = `UPDATE production_transfer 
                      SET pt_status = ?
                      WHERE pt_transferid = ?`;

        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
            if (err) console.error("Error: ", err);

            res.json({
                msg: "success",
            });
        });
    } catch (error) {
        res.json({
            msg: error,
        });
    }
});

router.post("/approve", (req, res) => {
    try {
        let transferid = req.body.transferid;
        let status =
            req.body.status == dictionary.GetValue(dictionary.INP())
                ? dictionary.GetValue(dictionary.CND())
                : dictionary.GetValue(dictionary.INP());
        let data = [status, transferid];
        console.log(data);

        let sql_Update = `UPDATE production_transfer 
                      SET pt_status = ?
                      WHERE pt_transferid = ?`;

        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
            if (err) console.error("Error: ", err);

            res.json({
                msg: "success",
            });
        });
    } catch (error) {
        res.json({
            msg: error,
        });
    }
});

