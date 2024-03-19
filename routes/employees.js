var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "employees");
  const currentDate = new Date().toISOString().split("T")[0];
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT me_employeeid as me_employeeid, me_fullname as me_fullname, 
    mpt_positionname as me_position, me_contactinfo as me_contactinfo, me_datehired as me_datehired, 
    me_status as me_status, me_createdby as me_createdby, me_createddate as me_createddate
    FROM master_employees inner join master_position_type on me_position = mpt_positioncode;`;

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
    // let check_position_name = `select * from master_position_type where mpt_positionname='${positionname}'`;
    // mysql.Select(check_position_name, "MasterPositionType", (err, result) => {
    //   if (err) console.error("Error: ", err);

    //   if (result.length != 0) {
    //   } else {
    //     dataposition.push([positionname, status, createdby, createdate]);

    //     mysql.InsertTable("master_position_type",dataposition,(err, result) => {
    //         if (err) console.error("Error: ", err);
    //         let loglevel = dictionary.INF();
    //         let source = dictionary.MSTR();
    //         let message = `${dictionary.GetValue(
    //           dictionary.INSD()
    //         )} -  [${data}]`;
    //         let user = req.session.employeeid;

    //         Logger(loglevel, source, message, user);
    //       }
    //     );
    //   }
    // });
    //#endregion Position

    let sql_check = `select * from master_employees where me_fullname='${fullname}'`;

    mysql.Select(sql_check, "MasterEmployees", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
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

router.post("/delete", (req, res) => {
  try {
    const employeeid = req.body.employeeid;
    let status = "DELETED";
    let data = [status, employeeid];

    let sql_Update = `UPDATE master_employees SET me_status = ? WHERE me_employeeid = ?`;
    let sql_Update_user = `UPDATE master_user SET mu_status = ? WHERE mu_employeeid = ?`;

    mysql.UpdateMultiple(sql_Update_user, data, (err, userUpdateResult) => {
      if (err) {
        console.error("Error: ", err);
        return res.json({
          msg: err,
        });
      }

      let loglevel = dictionary.INF();
      let source = dictionary.MSTR();
      let message = `${dictionary.GetValue(
        dictionary.UPDT()
      )} -  [${sql_Update_user}]`;
      let user = req.session.employeeid;

      Logger(loglevel, source, message, user);

      mysql.UpdateMultiple(sql_Update, data, (err, employeeUpdateResult) => {
        if (err) {
          console.error("Error: ", err);
          return res.json({
            msg: err,
          });
        }

        console.log("Employee update result:", employeeUpdateResult);
        console.log("User update result:", userUpdateResult);
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
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/edit", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let positionname = req.body.positionname;
    let contactinfo = req.body.contactinfo;
    let fullname = req.body.fullname;

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

    if (fullname) {
      sql_Update += ` me_fullname = ?,`;
      data.push(fullname);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE me_employeeid = ?;`;
    data.push(employeeid);

    let sql_check = `SELECT * FROM master_employees WHERE me_employeeid='${employeeid}'`;

    mysql.Select(sql_check, "MasterEmployees", (err, result) => {
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
      msg: "error",
    });
  }
});

router.get("/getactive", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let sql = `select * from master_employees where me_status='${status}'`;

    mysql.Select(sql, "MasterEmployees", (err, result) => {
      if (err) console.error("Error: ", err);

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
