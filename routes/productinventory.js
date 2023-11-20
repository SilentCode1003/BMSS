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
        let transferid = req.body.transferid;
        let status = dictionary.GetValue(dictionary.CMP());
        let sql = `select pi_quantity from product_inventory where pi_productid = '${productid}' and pi_branchid = '${branchid}'`;

        function updatestatus(updatedata) {
            let sql_Update_status = `UPDATE production_transfer SET pt_status = ? WHERE pt_productid = ? and pt_branchid = ? and pt_transferid = ?`
            
            mysql.UpdateMultiple(sql_Update_status, updatedata, (err, result) => {
                if (err) {
                    console.error('Error: ', err);

                }
                res.json({
                    msg: 'success',
                })
                console.log(result)
            });
        }

        function deduct(){
            let sql = `select pi_quantity from production_inventory where pi_productid = '${productid}'`;

            mysql.Select(sql, 'ProductInventory', (err, result) => {
                if (err) {
                    return res.json({
                        msg: err
                    })
                }
                currentquantity = result[0].quantity
                let sql_add = `UPDATE production_inventory SET pi_quantity = ? WHERE pi_productid = ?`;

                let finalquantity = parseFloat(currentquantity) - parseFloat(quantity)
                let data = [finalquantity, productid];
                mysql.UpdateMultiple(sql_add, data, (err, result) => {
                    if (err) console.error("Error: ", err);
                });
            });
        }

        function addquantity(finalquantity, productid, branchid) {
            deduct();
            let sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_productid = ? AND pi_branchid = ?`;
            let data = [finalquantity, productid, branchid];
            mysql.UpdateMultiple(sql_add, data, (err, result) => {
                if (err) console.error("Error: ", err);
                let updatedata = [status, productid, branchid, transferid]
                updatestatus(updatedata)
            });
        }

        mysql.Select(sql, 'ProductInventory', (err, result) => {
            if (err) {
                return res.json({
                    msg: err
                })
            }
            let currentquantity = result[0].quantity;
            console.log("productid: "+ productid)
            console.log("branchid: "+ branchid)
            console.log("quantity:" +quantity)
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

router.post('/addinventory', (req, res) => {
    try {
        let productdata = JSON.parse(req.body.productdata);
        let completedIterations = 0;
        let totalIterations = productdata.length;
        console.log("total loop: "+totalIterations)

        productdata.forEach( (item, index) => {
            let productid = item.productid;
            let quantity = item.quantity;
            let branchid = item.branchid;

            console.log("Product id: " + productid)
            console.log("quantity: " + quantity)
            console.log("branch id: " + branchid)
            
            let sql = `select pi_quantity from product_inventory where pi_productid = '${productid}' and pi_branchid = '${branchid}'`;

            mysql.Select(sql, 'ProductInventory', (err, result) => {
                if (err) {
                    return res.json({
                        msg: err
                    })
                }
                console.log("current quantity: "+result[0].quantity)
                let initialquantity = result[0].quantity;
                let finalquantity = parseFloat(initialquantity) + parseFloat(quantity);
                let data = [finalquantity, productid, branchid];
                console.log(data)
                let sql_Update = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_productid = ? AND pi_branchid = ?`;

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
                
                console.log(helper.GetCurrentDatetime());
            });
        
        });

    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/syncinventory', (req, res) => {
    try {
        let branchdata = [];
        let productdata = [];
        let quantity = 0;

        let sqlgetbranch = `select mb_branchid from master_branch`;

        mysql.Select(sqlgetbranch, "MasterBranch", (err, result) => {
            if (err) {
            return res.json({
                msg: err,
            });
            }

            result.forEach( (item, index) => {
                let branchid = item.branchid;
                branchdata.push([branchid])
            });

            let sqlgetproduct = `select mp_productid from master_product`;

            mysql.Select(sqlgetproduct, 'MasterProduct', (err, result) => {
                if (err) {
                    return res.json({
                        msg: err
                    })
                }
    
                result.forEach( (item, index) => {
                    let productid = item.productid;
                    productdata.push([productid])
                });
                
                branchdata.forEach(branchID => {
                    productdata.forEach(productID => {
                        let inventoryid = productID + branchID;

                        let check_inventory = `SELECT * FROM product_inventory WHERE pi_productid='${productID}' AND pi_branchid='${branchID}'`;
                        mysql.Select(check_inventory, "ProductInventory", (err, result) => {
                            if (err) {
                                console.error("Error: ", err);
                            } else {
                                if (result.length !== 0) {
                                    console.log(`Inventory Exists! ProductID: ${productID} with BranchID: ${branchID}`);
                                } else {
                                    let productinventory = [
                                        [inventoryid, productID, branchID, quantity]
                                    ];

                                    mysql.InsertTable("product_inventory", productinventory, (err, result) => {
                                        if (err) {
                                            console.error("Error: ", err);
                                        } else {
                                            console.log(`Inventory Added! ProductID: ${productID} and BranchID: ${branchID}`);
                                            // let loglevel = dictionary.INF();
                                            // let source = dictionary.MSTR();
                                            // let message = `${dictionary.GetValue(
                                            //   dictionary.INSD()
                                            // )} -  [Product Inventory: ${productinventory}]`;
                                            // let user = req.session.employeeid;
                                            // Logger(loglevel, source, message, user);
                                        }
                                    });
                                }
                            }
                        });

                    });
                    
                });

            });
        });

        res.json({
            msg: 'success',
        })

    } catch (error) {
        res.json({
            msg: error
        })
    }
});

router.post('/getproduct', (req, res) => {
    try {
        let productid = req.body.productid;

        let sql = `select * from product_inventory where pi_productid = '${productid}'`;

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