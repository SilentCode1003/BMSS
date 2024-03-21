var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "materialcount");
});

module.exports = router;

router.get('/load', (req, res) => {
    try {
        let sql = `select * from production_material_count`;

        mysql.Select(sql, 'ProductionMaterialCount', (err, result) => {
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
        let materialdata = JSON.parse(req.body.materialdata);
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let totalIterations = materialdata.length;
        let completedIterations = 0;
        
        console.log(materialdata);

        materialdata.forEach(function (item, index) {
            let productid = item.productid;
            let quantity = item.quantity;
            let unit = item.unit;

            let sql_check = `select * from production_material_count where pmc_productid='${productid}'`;

            mysql.Select(sql_check, 'ProductionMaterialCount', (err, result) => {
                if (err) {
                    console.error('Error: ', err);
                    return res.json({ msg: err });
                }

                let rowData = [];

                if (result.length != 0) {
                    let getquantity = `select pmc_quantity as existingquantity from production_material_count where pmc_productid='${productid}'`;

                    mysql.SelectResult(getquantity, (err, result) => {
                        if (err) {
                            return res.json({ msg: err });
                        }
                        let currentQuantity = result[0].existingquantity;
                        let totalQuantity = parseFloat(currentQuantity) + parseFloat(quantity);
                        let sql_Update = `UPDATE production_material_count SET pmc_quantity = ? WHERE pmc_productid = ?`;

                        let data = [
                            totalQuantity,
                            productid
                        ];
                        console.log(data);

                        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                            if (err) {
                                console.error('Error: ', err);
                            }
                            completedIterations++;
                            if (completedIterations === totalIterations) {
                                res.json({
                                    msg: "success",
                                    data: result,
                                });
                            }
                        });
                    });
                } else {
                    rowData.push([
                        productid,
                        quantity,
                        unit,
                        status,
                        createdby,
                        createdate
                    ])
                    console.log(rowData)
                    mysql.InsertTable('production_material_count', rowData, (err, result) => {
                        if (err) {
                            console.error('Error: ', err);
                        }
                        completedIterations++;
                        if (completedIterations === totalIterations) {
                            res.json({
                                msg: "success",
                                data: result,
                            });
                        }
                    })
                }
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
        let countid = req.body.countid;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()) : dictionary.GetValue(dictionary.ACT());
        let data = [status, countid];
        console.log(data);

        let sql_Update = `UPDATE production_material_count 
                       SET pmc_status = ?
                       WHERE pmc_countid = ?`;


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


router.post("/getcurrentquantity", (req, res) => {
    try {
        let productid = req.body.productid;
        let sql = `select pmc_quantity as currentquantity from production_material_count where pmc_productid='${productid}'`;

        mysql.SelectResult(sql, (err, result) => {
            if (err) {
                return res.json({
                    msg: err,
                });
            }

            res.json({
                msg: "success",
                data: result,
            });
        });
    } catch (error) {
        res.json({
            msg: error,
        });
    }
});

router.post("/getUnits", (req, res) => {
    try {
        let productid = req.body.productid;
        let sql = `select pmc_unit as unit from production_material_count where pmc_productid='${productid}'`;

        mysql.SelectResult(sql, (err, result) => {
            if (err) {
                return res.json({
                    msg: err,
                });
            }

            res.json({
                msg: "success",
                data: result,
            });
        });
    } catch (error) {
        res.json({
            msg: error,
        });
    }
});

router.get("/getmaterial", (req, res) => {
    try {
        let sql = `SELECT mpm_productid as id, mpm_productname as materialname, mpm_category as category, pmc_unit as unit, pmc_quantity as quantity, mpm_price as unitcost
        FROM salesinventory.production_materials
        INNER JOIN production_material_count ON pmc_productid = mpm_productid;`;

        mysql.SelectResult(sql, (err, result) => {
            if (err) {
                return res.json({
                    msg: err,
                });
            }

            res.json({
                msg: "success",
                data: result,
            });
        });
    } catch (error) {
        res.json({
            msg: error,
        });
    }
});