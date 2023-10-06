var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("access", {
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
    employeeid: req.session.employeeid,
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
    let sql = `select * from master_access_type`;

    mysql.Select(sql, "MasterAccessType", (err, result) => {
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
    let accessname = req.body.accessname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let logdata = [];
    let data = [];

    let sql_check = `select * from master_access_type where mat_accessname='${accessname}'`;

    mysql.Select(sql_check, "MasterAccessType", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([accessname, status, createdby, createdate]);

        mysql.InsertTable("master_access_type", data, (err, result) => {
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
    let accesscode = req.body.accesscode;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, accesscode];
    console.log("something");
    console.log(data);

    let sql_Update = `UPDATE master_access_type 
                       SET mat_status = ?
                       WHERE mat_accesscode = ?`;

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
    let accessnamemodal = req.body.accessnamemodal;
    let accesscode = req.body.accesscode;

    let data = [accessnamemodal, accesscode];

    let sql_Update = `UPDATE master_access_type 
                       SET mat_accessname = ?
                       WHERE mat_accesscode = ?`;

    let sql_check = `SELECT * FROM master_access_type WHERE mat_accessname='${accessnamemodal}'`;

    mysql.Select(sql_check, "MasterAccessType", (err, result) => {
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
