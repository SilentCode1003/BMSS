var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("payment", {
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

router.get("/load", (req, res) => {
  try {
    let sql = `select * from master_payment`;

    mysql.Select(sql, "MasterPayment", (err, result) => {
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
    let paymentname = req.body.paymentname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let logdata = [];
    let data = [];

    let sql_check = `select * from master_payment where mp_paymentname='${paymentname}'`;

    mysql.Select(sql_check, "MasterPayment", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([paymentname, status, createdby, createdate]);

        mysql.InsertTable("master_payment", data, (err, result) => {
          if (err) console.error("Error: ", err);
          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.INSD()
          )} -  [${data}]`;
          let user = req.session.employeeid;

          Logger(loglevel, source, message, user);

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
    let paymentcode = req.body.paymentcode;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, paymentcode];
    console.log("something");
    console.log(data);

    let sql_Update = `UPDATE master_payment 
                       SET mp_status = ?
                       WHERE mp_paymentid = ?`;

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      let loglevel = dictionary.INF();
      let source = dictionary.MSTR();
      let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
      let user = req.session.employeeid;

      Logger(loglevel, source, message, user);

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
    let paymentnamemodal = req.body.paymentnamemodal;
    let paymentcode = req.body.paymentcode;

    let data = [paymentnamemodal, paymentcode];

    let sql_Update = `UPDATE master_payment 
                       SET mp_paymentname = ?
                       WHERE mp_paymentid = ?`;

    let sql_check = `SELECT * FROM master_payment WHERE mp_paymentname='${paymentnamemodal}'`;

    mysql.Select(sql_check, "MasterPayment", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length == 1) {
        return res.json({
          msg: "duplicate",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.UPDT()
          )} -  [${sql_Update}]`;
          let user = req.session.employeeid;

          Logger(loglevel, source, message, user);

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
