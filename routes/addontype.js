var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "addontype");
  // res.render('addontype',{
  //     positiontype: req.session.positiontype,
  //     accesstype: req.session.accesstype,
  //     username: req.session.username,
  //     fullname: req.session.fullname,
  //     employeeid: req.session.employeeid,
  //     branchid: req.session.branchid,
  //     usercode: req.session.usercode
  // })
});
module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = "select * from addon_type";

    mysql.Selects(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ msg: err });
      }

      if (result.length != 0) {
        let data = DataModeling(result, "at_");
        res.json({ msg: "success", data: data });
      } else {
        res.json({
          msg: "success",
          data: result,
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/save", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby =
      req.session.fullname == null ? "DEV42" : req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    const { name } = req.body;

    let sql = helper.InsertStatement("addon_type", "at", [
      "name",
      "status",
      "createdby",
      "createddate",
    ]);
    let data = [[name, status, createdby, createddate]];
    let checkStatement = helper.SelectStatement(
      `select * from addon_type where at_name = ?`,
      [name]
    );

    Check(checkStatement)
      .then((result) => {
        console.log(result);
        if (result != 0) {
          return res.json({
            msg: "exist",
          });
        } else {
          mysql.Insert(sql, data, (err, result) => {
            if (err) {
              console.log(err);
              res.json({ msg: err });
            }

            console.log(result);

            res.json({ msg: "success" });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({ msg: error });
      });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
});

router.put("/status", (req, res) => {
  try {
    let id = req.body.id;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, id];

    let updateStatement = helper.UpdateStatement(
      "addon_type",
      "at",
      ["status"],
      ["id"]
    );

    mysql.UpdateMultiple(updateStatement, data, (err, result) => {
      if (err) console.error("Error: ", err);

      res.json({ msg: "success" });
    });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
});

router.put("/edit", (req, res) => {
  try {
    const { name,  id } = req.body;

    console.log(name, id);

    let data = [];
    let columns = [];
    let arguments = [];

    if (name) {
      data.push(name);
      columns.push("name");
    }

    if (id) {
      data.push(id);
      arguments.push("id");
    }

    let updateStatement = helper.UpdateStatement(
      "addon_type",
      "at",
      columns,
      arguments
    );

    let checkStatement = helper.SelectStatement(
      `select * from addon_type where at_name = ?`,
      [name]
    );

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json({ msg: "exist" });
        } else {
          mysql.UpdateMultiple(updateStatement, data, (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);

            res.json({
              msg: "success",
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({ msg: error });
      });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
});

router.post("/getactive", (req, res) => {
  try {
    let status = req.body.status;

    let sql = `select * from addon_type where at_status = '${status}'`;

    mysql.Selects(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ msg: err });
      }
      if (result != 0) {
        let data = DataModeling(result, "at_");
        res.json({ msg: "success", data: data });
      } else {
        res.json({ msg: "success", data: result });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

//#region FUNCTION
function Check(sql) {
  return new Promise((resolve, reject) => {
    mysql.Selects(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}
//#endregion
