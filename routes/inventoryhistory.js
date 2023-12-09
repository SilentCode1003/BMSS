var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "inventoryhistory");
});

module.exports = router;

router.get('/load', (req, res) => {
    try {
        let sql = `SELECT * FROM inventory_history`;

        mysql.Select(sql, 'InventoryHistory', (err, result) => {
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


