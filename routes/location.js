var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "location");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `select * from master_location`;

    mysql.Select(sql, "MasterLocation", (err, result) => {
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
    let locationname = req.body.locationname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    let data = [];

    let sql_check = `select * from master_location where ml_locationname='${locationname}'`;

    mysql.Select(sql_check, "MasterCategory", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([locationname, status, createdby, createddate]);

        mysql.InsertTable("master_location", data, (err, result) => {
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
    let locationid = req.body.locationid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, locationid];
    console.log(data);

    let sql_Update = `UPDATE master_location 
                       SET ml_status = ?
                       WHERE ml_locationid = ?`;

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
    let locationname = req.body.locationname;
    let locationid = req.body.locationid;

    let data = [locationname, locationid];
    console.log(data);
    let sql_Update = `UPDATE master_location 
                       SET ml_locationname = ?
                       WHERE ml_locationid = ?`;

    let sql_check = `SELECT * FROM master_location WHERE ml_locationname='${locationname}'`;

    mysql.Select(sql_check, "MasterLocation", (err, result) => {
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
    let sql = `select * from master_location where ml_status='${status}'`;

    mysql.selec(sql, "MasterLocation", (err, result) => {
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

router.post("/getLocations", (req, res) => {
  try {
    const fromlocationid = req.body.fromlocationid;
    const tolocationid = req.body.tolocationid;
    let sql = `SELECT 
    (SELECT ml_locationname FROM master_location WHERE ml_locationid = '${fromlocationid}') AS fromlocation,
    (SELECT ml_locationname FROM master_location WHERE ml_locationid = '${tolocationid}') AS tolocation`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      //console.log(result[0]);
      res.json({
        msg: "success",
        data: result[0], 
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});