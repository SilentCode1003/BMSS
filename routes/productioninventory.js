var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
    res.render("productioninventory", {
        positiontype: req.session.positiontype,
        accesstype: req.session.accesstype,
        username: req.session.username,
        fullname: req.session.fullname,
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
        let sql = `select * from production_inventory`;

        mysql.Select(sql, 'ProductionInventory', (err, result) => {
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


