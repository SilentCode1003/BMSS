var express = require("express");
var router = express.Router();
const { Readable } = require("stream");

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "productinventory");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT 
                pi_inventoryid as inventoryid, mp_description as productname, pi_branchid as branchid, pi_quantity as quantity, mc_categoryname as category, mp_productid as productid
            from product_inventory
            INNER JOIN master_product on mp_productid = pi_productid
            INNER JOIN master_branch on mb_branchid = pi_branchid
            INNER JOIN master_category on mc_categorycode = pi_category
            ORDER BY mp_description;`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      console.log(helper.GetCurrentDatetime());

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

router.get("/load/:id", (req, res) => {
  try {
    const id = req.params.id;
    let sql = `select pi_inventoryid as id, pi_branchid as branchid, pi_quantity as stock,
            mb_branchname as branchname
            from product_inventory 
            INNER JOIN master_branch on mb_branchid = pi_branchid
            WHERE pi_productid ='${id}' AND mb_status = 'ACTIVE'`;

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

router.post("/add", (req, res) => {
  try {
    let branchid = req.body.branchid;
    let productid = req.body.productid;
    let quantity = req.body.quantity;
    let transferid = req.body.transferid;
    let status = dictionary.GetValue(dictionary.CMP());
    let sql = `select pi_quantity from product_inventory where pi_productid = '${productid}' and pi_branchid = '${branchid}'`;

    function updatestatus(updatedata) {
      let sql_Update_status = `UPDATE production_transfer SET pt_status = ? WHERE pt_productid = ? and pt_branchid = ? and pt_transferid = ?`;

      mysql.UpdateMultiple(sql_Update_status, updatedata, (err, result) => {
        if (err) {
          console.error("Error: ", err);
        }
        res.json({
          msg: "success",
        });
        console.log(result);
      });
    }

    function deduct() {
      let sql = `select pi_quantity from production_inventory where pi_productid = '${productid}'`;

      mysql.Select(sql, "ProductInventory", (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          });
        }
        currentquantity = result[0].quantity;
        let sql_add = `UPDATE production_inventory SET pi_quantity = ? WHERE pi_productid = ?`;

        let finalquantity = parseFloat(currentquantity) - parseFloat(quantity);
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
        let updatedata = [status, productid, branchid, transferid];
        updatestatus(updatedata);
      });
    }

    mysql.Select(sql, "ProductInventory", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      let currentquantity = result[0].quantity;
      console.log("productid: " + productid);
      console.log("branchid: " + branchid);
      console.log("quantity:" + quantity);
      console.log("Current Quantity: " + currentquantity);
      let finalquantity = parseFloat(currentquantity) + parseFloat(quantity);
      addquantity(finalquantity, productid, branchid);

      console.log(helper.GetCurrentDatetime());
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/addinventory", (req, res) => {
  try {
    let productdata = JSON.parse(req.body.productdata);
    let productionid = req.body.productionid;
    let completedIterations = 0;
    let totalIterations = productdata.length;
    // console.log("total loop: " + totalIterations);

    productdata.forEach((item, index) => {
      const { productid, quantity, branchid } = item;

      let sql = `select pi_quantity from product_inventory where pi_productid = '${productid}' and pi_branchid = '${branchid}'`;
      let sql_notification = `select * from notification where n_inventoryid = '${productid}${branchid}' and n_branchid = '${branchid}'`;
      // console.log(sql_notification);

      mysql.Select(sql_notification, "Notification", (err, result) => {
        if (err) {
          console.log("Error: ", err);
        }
        // console.log("Data notif:", result);
        if (result.length != 0) {
          let sql_updateChecker = `UPDATE notification SET n_checker = ? WHERE n_inventoryid = ? and n_branchid = ?`;
          let inventoryid = productid + branchid;
          let sql_updateData = [0, inventoryid, branchid];

          mysql.UpdateMultiple(
            sql_updateChecker,
            sql_updateData,
            (err, result) => {
              if (err) {
                console.error("Error: ", err);
              }

              completedIterations++;
              if (completedIterations === totalIterations) {
                res.json({
                  msg: "success",
                  data: result,
                });
              }
            }
          );
        }
      });

      mysql.Select(sql, "ProductInventory", (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          });
        }
        // console.log("current quantity: "+result[0].quantity)
        let initialquantity = result[0].quantity;
        let finalquantity = parseFloat(initialquantity) + parseFloat(quantity);
        const inventoryid = `${productid}${branchid}`;

        let data = [finalquantity, inventoryid];
        // console.log(data)
        let sql_Update = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`;

        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) {
            console.error("Error: ", err);
          }
          let movementid;
          let type;
          if (productionid) {
            movementid = productionid;
            type = "PRODUCTION";
          } else {
            movementid = parseInt(inventoryid);
            type = "REPLENISHMENT";
          }

          const record_query = helper.InsertStatement("history", "h", [
            "branch",
            "quantity",
            "date",
            "productid",
            "inventoryid",
            "movementid",
            "type",
            "stocksafter",
          ]);
          const history_data = [
            [
              branchid,
              quantity,
              helper.GetCurrentDatetime(),
              productid,
              inventoryid,
              movementid,
              type,
              finalquantity,
            ],
          ];
          mysql.Insert(record_query, history_data, (err, result) => {
            if (err) {
              console.log(err);
              res.status(400), res.json({ msg: err });
            }
          });

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
      msg: error,
    });
  }
});

router.post("/syncinventory", (req, res) => {
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

      result.forEach((item, index) => {
        let branchid = item.branchid;
        branchdata.push([branchid]);
      });

      let sqlgetproduct = `select mp_productid from master_product`;

      mysql.Select(sqlgetproduct, "MasterProduct", (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          });
        }

        result.forEach((item, index) => {
          let productid = item.productid;
          productdata.push([productid]);
        });

        branchdata.forEach((branchID) => {
          productdata.forEach((productID) => {
            let inventoryid = productID + branchID;

            let check_inventory = `SELECT * FROM product_inventory WHERE pi_productid='${productID}' AND pi_branchid='${branchID}'`;
            mysql.Select(check_inventory, "ProductInventory", (err, result) => {
              if (err) {
                console.error("Error: ", err);
              } else {
                if (result.length !== 0) {
                  console.log(
                    `Inventory Exists! ProductID: ${productID} with BranchID: ${branchID}`
                  );
                } else {
                  let getcategory = `select mp_category as category from master_product where mp_productid = ${productID}`;

                  mysql.SelectResult(getcategory, (err, result) => {
                    if (err) {
                      console.log("ERROR!");
                    }
                    let category = result[0].category;

                    let productinventory = [
                      [inventoryid, productID, branchID, quantity, category],
                    ];

                    mysql.InsertTable(
                      "product_inventory",
                      productinventory,
                      (err, result) => {
                        if (err) {
                          console.error("Error: ", err);
                        } else {
                          console.log(
                            `Inventory Added! ProductID: ${productID} and BranchID: ${branchID}`
                          );
                        }
                      }
                    );
                  });
                }
              }
            });
          });
        });

        res.json({
          msg: "success",
        });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getproduct", (req, res) => {
  try {
    let productid = req.body.productid;

    let sql = `select * from product_inventory where pi_productid = '${productid}'`;

    console.log(productid);

    mysql.Select(sql, "ProductInventory", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      console.log(helper.GetCurrentDatetime());

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

router.post("/getinventory", (req, res) => {
  try {
    let { branchid, category } = req.body;
    let sql = `SELECT mp_description as productname, mc_categoryname as category, pi_branchid as branchid, pi_quantity as quantity, pp_price as unitcost FROM product_inventory
        INNER JOIN master_product ON mp_productid = pi_productid
        INNER JOIN product_price ON pp_product_id = pi_productid
        INNER JOIN master_category ON mc_categorycode = pi_category`;

    if (branchid !== "All" || category !== "All") {
      sql += " WHERE";

      if (branchid !== "All") {
        sql += ` pi_branchid = '${branchid}'`;
      }

      if (category !== "All") {
        if (branchid !== "All") {
          sql += " AND";
        }
        sql += ` mc_categoryname = '${category}'`;
      }
    }
    console.log(sql);
    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      console.log(helper.GetCurrentDatetime());

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

router.post("/by-branch-and-category", (req, res) => {
  try {
    let { branch, category } = req.body;

    let sql = `SELECT pi_inventoryid as inventoryid, mp_description as productname, mb_branchname as branchid,
                        pi_quantity as quantity, mc_categoryname as category, mp_productid as productid
                FROM product_inventory 
                INNER JOIN master_product ON mp_productid = pi_productid
                INNER JOIN master_category ON mc_categorycode = pi_category
                INNER JOIN master_branch ON mb_branchid = pi_branchid
                WHERE mc_categoryname = '${category}' AND pi_branchid = '${branch}';`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      console.log(helper.GetCurrentDatetime());

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

router.post("/by-category", (req, res) => {
  try {
    let { category } = req.body;

    let sql = `SELECT pi_inventoryid as inventoryid, mp_description as productname, mb_branchname as branchid,
                        pi_quantity as quantity, mc_categoryname as category, mp_productid as productid
                FROM product_inventory 
                INNER JOIN master_product ON mp_productid = pi_productid
                INNER JOIN master_category ON mc_categorycode = pi_category
                INNER JOIN master_branch ON mb_branchid = pi_branchid
                WHERE mc_categoryname = '${category}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      console.log(helper.GetCurrentDatetime());

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

router.post("/by-branch", (req, res) => {
  try {
    let { branch } = req.body;
    let sql = `SELECT pi_inventoryid as inventoryid, mp_description as productname, mb_branchname as branchid, 
                        pi_quantity as quantity, mc_categoryname as category, mp_productid as productid
                FROM product_inventory 
                INNER JOIN master_product ON mp_productid = pi_productid
                INNER JOIN master_category ON mc_categorycode = pi_category
                INNER JOIN master_branch ON mb_branchid = pi_branchid
                WHERE pi_branchid = '${branch}';`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      console.log(helper.GetCurrentDatetime());

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
