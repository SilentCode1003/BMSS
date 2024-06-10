var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");
/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "productioncomponents");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT pc_componentid as componentid, pc_productid as productid, mp_description as productname, pc_status as status, pc_createddate as createddate, pc_createdby as createdby
      FROM product_component INNER JOIN master_product ON mp_productid = pc_productid 
      ORDER BY mp_description`;

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

router.post("/save", (req, res) => {
  try {
    let productid = req.body.productid;
    let components = req.body.components;
    let overallTotal = req.body.overallTotal;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    console.log("Components:  " + components);
    console.log("Product ID:  " + productid);
    let data = [];

    let sql_product = `SELECT * FROM master_product where mp_productid = '${productid}'`;
    let sql_check = `select * from product_component where pc_productid ='${productid}'`;

    mysql.Select(sql_check, "ProductionComponents", (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result);
      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        mysql.Select(sql_product, "MasterProduct", (err, result) => {
          if (result.length == 0) {
            console.error("Error: ", result.length);
          } else {
            let sql_Update = `UPDATE master_product SET mp_cost = ? WHERE mp_productid = ?`;
            let productData = [overallTotal, productid];
            mysql.UpdateMultiple(sql_Update, productData, (err, result) => {
              if (err) {
                console.error("Error: ", err);
                return res.json({
                  msg: "error",
                });
              }
              console.log(result);
            });
          }
        });

        data.push([productid, components, status, createdby, createddate]);

        mysql.InsertTable("product_component", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result[0]["id"]);

          res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/status", (req, res) => {
  try {
    let productid = req.body.productid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, productid];
    console.log(data);

    let sql_Update = `UPDATE production_materials SET mpm_status = ? WHERE mpm_productid = ?`;

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

router.post("/edit", (req, res) => {
  try {
    let componentid = req.body.componentid;
    let componentsdata = req.body.componentsdata;
    let productid = req.body.productid;
    let overallTotal = req.body.overallTotal;

    let data = [componentsdata, componentid];
    console.log(data);
    let sql_Update = `UPDATE product_component 
                       SET pc_components = ?
                       WHERE pc_componentid = ?`;
    let sql_check = `SELECT * FROM product_component WHERE pc_componentid='${componentid}'`;
    let sql_product = `SELECT * FROM master_product where mp_productid = '${productid}'`;

    mysql.Select(sql_check, "ProductComponent", (err, result) => {
      if (err) {
        console.error("Error: ", err);
        return res.json({
          msg: "error",
        });
      }

      if (result.length !== 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) {
            console.error("Error: ", err);
            return res.json({
              msg: "error",
            });
          }

          mysql.Select(sql_product, "MasterProduct", (err, result) => {
            if (result.length == 0) {
              console.error("Error: ", result.length);
            } else {
              let sql_Update = `UPDATE master_product SET mp_cost = ? WHERE mp_productid = ?`;
              let productData = [overallTotal, productid];
              mysql.UpdateMultiple(sql_Update, productData, (err, result) => {
                if (err) {
                  console.error("Error: ", err);
                  return res.json({
                    msg: "error",
                  });
                }
                console.log(result);
              });
            }
          });

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
    });
  }
});

router.get("/active", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let sql = `select * from production_materials where ml_status='${status}'`;

    mysql.Select(sql, "ProductionMaterials", (err, result) => {
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

router.post("/getcomponents", (req, res) => {
  try {
    let productid = req.body.productid;
    let sql = `select pc_components as components from product_component where pc_productid='${productid}'`;

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

router.post("/getdetails", (req, res) => {
  try {
    let componentid = req.body.componentid;
    let sql = `select pc_components as components from product_component where pc_componentid ='${componentid}'`;

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
