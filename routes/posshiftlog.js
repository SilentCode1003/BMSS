var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("posshiftlog", {
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

router.post("/getposshift", (req, res) => {
  try {
    let posid = req.body.posid;
    let status = dictionary.GetValue(dictionary.STR());
    let sql = `select * from pos_shift_logs where psl_posid='${posid}' and psl_status='${status}'`;

    mysql.Select(sql, "POSShiftLogs", (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);
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

router.post("/startshift", (req, res) => {
  try {
    let startdate = helper.GetCurrentDate();
    let closed_status = dictionary.GetValue(dictionary.CLD());
    let start_status = dictionary.GetValue(dictionary.STR());
    let posid = req.body.posid;
    let sql_check = `select * from pos_shift_logs where psl_posid='${posid}' and psl_status='${closed_status}' and psl_date='${startdate}'`;

    console.log(sql_check);
    mysql.Select(sql_check, "POSShiftLogs", (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        let data = [];
        let shift = parseInt(result[0].shift) + 1;
        data.push([posid, startdate, shift, start_status]);

        mysql.InsertTable("pos_shift_logs", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      } else {
        let data = [];
        let shift = "1";
        data.push([posid, startdate, shift, start_status]);

        mysql.InsertTable("pos_shift_logs", data, (err, result) => {
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
