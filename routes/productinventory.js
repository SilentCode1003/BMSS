var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function (req, res, next) {
    res.render('productinventory', {
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
        let sql = `select * from product_inventory`;

        mysql.Select(sql, 'ProductInventory', (err, result) => {
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

router.post('/add', (req, res) => {
    try {
        let branchid = req.body.branchid;
        let productid = req.body.productid;
        let quantity = req.body.quantity;
        let sql = `select pi_quantity from product_inventory where pi_productid = '${productid}' and pi_branchid = '${branchid}'`;

        function addquantity(finalquantity, productid, branchid) {
            let sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_productid = ? AND pi_branchid = ?`;
            let data = [finalquantity, productid, branchid];
            mysql.UpdateMultiple(sql_add, data, (err, result) => {
                if (err) console.error("Error: ", err);

                res.json({
                    msg: "success",
                });
            });
        }

        mysql.Select(sql, 'ProductInventory', (err, result) => {
            if (err) {
                return res.json({
                    msg: err
                })
            }
            let currentquantity = result[0].quantity;
            console.log("Current Quantity: " + currentquantity)
            let finalquantity = parseFloat(currentquantity) + parseFloat(quantity);
            addquantity(finalquantity, productid, branchid);

            console.log(helper.GetCurrentDatetime());

        });
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/deduct', (req, res) => {
    try {
        let sql = `select * from product_inventory`;

        mysql.Select(sql, 'ProductInventory', (err, result) => {
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