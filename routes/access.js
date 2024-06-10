var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");
const { logEvents } = require("../middleware/logger");
const verifyJWT = require("../middleware/authenticator");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "access");
});

// router.use(verifyJWT);

router.get("/load", (req, res) => {
  try {
    let sql = `select * from master_access_type`;
    mysql.Select(sql, "MasterAccessType", (err, result) => {
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
      if (err) {
        res.status(400), res.json({ msg: "error", data: err });
      }

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([accessname, status, createdby, createdate]);

        mysql.InsertTable("master_access_type", data, (err, result) => {
          if (err) {
            res.status(400), res.json({ msg: "error", data: err });
          } else {
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
          }
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

    let sql_Update = `UPDATE master_access_type 
                       SET mat_status = ?
                       WHERE mat_accesscode = ?`;

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

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

module.exports = router;
