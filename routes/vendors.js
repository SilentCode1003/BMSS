var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("vendors", {
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
    let sql = `select * from master_vendor`;

    mysql.Select(sql, "MasterVendor", (err, result) => {
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
    let vendorname = req.body.vendorname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    let data = [];

    let sql_check = `select * from master_vendor where mv_vendorname ='${vendorname}'`;

    mysql.Select(sql_check, "MasterVendor", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([vendorname, status, createdby, createddate]);

        mysql.InsertTable("master_vendor", data, (err, result) => {
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
    let vendorid = req.body.vendorid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, vendorid];
    console.log(data);

    let sql_Update = `UPDATE master_vendor 
                       SET mv_status = ?
                       WHERE mv_vendorid = ?`;

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
    let vendorname = req.body.vendorname;
    let vendorid = req.body.vendorid;

    let data = [vendorname, vendorid];
    console.log(data);
    let sql_Update = `UPDATE master_vendor 
                       SET mv_vendorname  = ?
                       WHERE mv_vendorid = ?`;

    let sql_check = `SELECT * FROM master_vendor WHERE mv_vendorname ='${vendorname}'`;

    mysql.Select(sql_check, "MasterVendor", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length == 1) {
        return res.json({
          msg: "duplicate",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

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

router.get("/active", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let sql = `select * from master_vendor where ml_status='${status}'`;

    mysql.Select(sql, "MasterVendor", (err, result) => {
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