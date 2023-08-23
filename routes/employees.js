var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  const currentDate = new Date().toISOString().split("T")[0];
  res.render("employees", {
    currentDate,
    roletype: req.session.roletype,
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
    let sql = `select * from master_employees`;

    mysql.Select(sql, "MasterEmployees", (err, result) => {
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
    let employeeid = req.body.employeeid;
    let fullname = req.body.fullname;
    let positionname = req.body.positionname;
    let contactinfo = req.body.contactinfo;
    let datehired = req.body.datehired;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let data = [];
    let dataposition = [];

    //#region Position
    let check_position_name = `select * from master_position_type where mpt_positionname='${positionname}'`;
    mysql.Select(check_position_name, "MasterPositionType", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
      } else {
        dataposition.push([positionname, status, createdby, createdate]);

        mysql.InsertTable(
          "master_position_type",
          dataposition,
          (err, result) => {
            if (err) console.error("Error: ", err);
          }
        );
      }
    });
    //#endregion Position

    let sql_check = `select * from master_employees where me_employeeid='${employeeid}'`;

    mysql.Select(sql_check, "MasterEmployees", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          employeeid,
          fullname,
          positionname,
          contactinfo,
          datehired,
          status,
          createdby,
          createdate,
        ]);

        mysql.InsertTable("master_employees", data, (err, result) => {
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

router.post("/status", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, employeeid];
    console.log(data);

    let sql_Update = `UPDATE master_employees 
                    SET me_status = ?
                    WHERE me_employeeid = ?`;

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

router.post("/delete", (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    let sql = `delete from master_employees where me_employeeid=?`;

    mysql.Delete(sql, `${employeeId}`, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      console.log(result);
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

router.post('/edit', (req, res) => {
  try {
      let employeeid = req.body.employeeid;
      let positionname = req.body.positionname;
      let contactinfo = req.body.contactinfo;
      
      let data = [];
      let sql_Update = `UPDATE master_employees SET`;

      if (positionname) {
          sql_Update += ` me_position = ?,`;
          data.push(positionname);
      }
      
      if (contactinfo) {
          sql_Update += ` me_contactinfo = ?,`;
          data.push(contactinfo);
      }

      sql_Update = sql_Update.slice(0, -1);
      sql_Update += ` WHERE me_employeeid = ?;`;
      data.push(employeeid);
      
      let sql_check = `SELECT * FROM master_employees WHERE me_employeeid='${employeeid}'`;

      mysql.Select(sql_check, 'MasterEmployees', (err, result) => {
          if (err) {
              console.error('Error: ', err);
              return res.json({
                  msg: 'error'
              });
          }

          if (result.length !== 1) {
              return res.json({
                  msg: 'notexist'
              });
          } else {
              mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                  if (err) console.error('Error: ', err);
                  console.log(result);

                  res.json({
                      msg: 'success',
                  });
              });
          }
      });
  } catch (error) {
      res.json({
          msg: 'error'
      });
  }
});