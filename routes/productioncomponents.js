var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("productioncomponents", {
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

router.get("/load", (req, res) => {
  try {
    let sql = `select * from product_component`;

    mysql.Select(sql, "ProductComponent", (err, result) => {
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

router.post("/save", (req, res) => {
  try {
    let productid = req.body.productid;
    let components = req.body.components;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    console.log("Components:  "+ components)
    console.log("Product ID:  "+ productid)
    let data = [];

    let sql_check = `select * from product_component where pc_productid ='${productid}'`;

    mysql.Select(sql_check, "ProductionComponents", (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result)
      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
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
    let productid = req.body.productid;
    let productname = req.body.productname;
    let description = req.body.description;
    let category = req.body.category;
    let vendorid = req.body.vendorid;
    let price = req.body.price;
  
    let data = [];

    let sql_Update = `UPDATE production_materials SET`;

    if (productname) {
      sql_Update += ` mpm_productname = ?,`;
      data.push(productname);
    }

    if (description) {
      sql_Update += ` mpm_description = ?,`;
      data.push(description);
    }
    
    if (category) {
      sql_Update += ` mpm_category = ?,`;
      data.push(category);
    }
    
    if (vendorid) {
      sql_Update += ` mpm_vendorid = ?,`;
      data.push(vendorid);
    }
    
    if (price) {
      sql_Update += ` mpm_price = ?,`;
      data.push(price);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE mpm_productid = ?;`;
    data.push(productid);

    let sql_check = `SELECT * FROM production_materials WHERE mpm_productid = '${productid}'`;

    mysql.Select(sql_check, "ProductionMaterials", (err, result) => {
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