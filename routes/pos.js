var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("pos", {
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

router.post("/save", (req, res) => {
  try {
    let posname = req.body.posname;
    let serial = req.body.serial;
    let min = req.body.min;
    let ptu = req.body.ptu;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let data = [];

    let sql_check = `select * from master_pos where mp_posname='${posname}'`;

    mysql.Select(sql_check, "MasterPos", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          posname,
          serial,
          min,
          ptu,
          status,
          createdby,
          createdate,
        ]);

        mysql.InsertTable("master_pos", data, (err, result) => {
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

router.get("/load", (req, res) => {
  try {
    let sql = `select * from master_pos`;

    mysql.Select(sql, "MasterPos", (err, result) => {
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

router.post("/status", (req, res) => {
  try {
    let posid = req.body.posid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, posid];
    console.log("something");
    console.log(data);

    let sql_Update = `UPDATE master_pos 
                     SET mp_status = ?
                     WHERE mp_posid = ?`;

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
    let posid = req.body.posid;
    let posname = req.body.posname;
    let serial = req.body.serial;
    let min = req.body.min;
    let ptu = req.body.ptu;

    let data = [];
    let sql_Update = `UPDATE master_pos SET`;

    if (posname != "") {
      sql_Update += ` mp_posname = ?,`;
      data.push(posname);
    }

    if (serial != "") {
      sql_Update += ` mp_serial = ?,`;
      data.push(serial);
    }

    if (min != "") {
      sql_Update += ` mp_min = ?,`;
      data.push(min);
    }

    if (ptu != "") {
      sql_Update += ` mp_ptu = ?,`;
      data.push(ptu);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE mp_posid = ?;`;
    data.push(posid);

    console.log(sql_Update);
    console.log(data);
    let sql_check = `SELECT * FROM master_pos WHERE mp_posid='${posid}'`;

    mysql.Select(sql_check, "MasterPos", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length !== 1) {
        return res.json({
          msg: "notexist",
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

router.post("/getposconfig", (req, res) => {
  try {
    let posid = req.body.posid;
    let sql = `select * from master_pos where mp_posid='${posid}'`;

    mysql.Select(sql, "MasterPos", (err, result) => {
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
