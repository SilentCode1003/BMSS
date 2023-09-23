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
    let cashier = req.body.cashier;
    let posid = req.body.posid;
    let sql_check = `select count(*) as count from pos_shift_logs where psl_posid='${posid}' and psl_status='${closed_status}' and psl_date='${startdate}'`;
    let shift_report = [];
    let insert_shift_report = `INSERT INTO shift_report(
      sr_date,
      sr_pos,
      sr_shift,
      sr_cashier,
      sr_status) VALUES ?`;

    mysql.SelectResult(sql_check, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        let data = [];
        let shift = parseInt(result[0].count) + 1;

        data.push([posid, startdate, shift, start_status]);
        shift_report.push([startdate, posid, shift, cashier, start_status]);

        mysql.InsertTable("pos_shift_logs", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          mysql.Insert(insert_shift_report, shift_report, (err, result) => {
            if (err) console.error("Error: ", err);
            console.log(result);

            res.json({
              msg: "success",
            });
          });
        });
      } else {
        let data = [];
        let shift = "1";

        data.push([posid, startdate, shift, start_status]);
        shift_report.push([startdate, posid, shift, cashier, start_status]);

        mysql.InsertTable("pos_shift_logs", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          mysql.Insert(insert_shift_report, shift_report, (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);

            res.json({
              msg: "success",
            });
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

router.post("/endshift", (req, res) => {
  try {
    let posid = req.body.posid;
    let status = dictionary.GetValue(dictionary.STR());
    let sql = `select * from pos_shift_logs where psl_posid ='${posid}' and psl_status='${status}'`;

    mysql.Select(sql, "POSShiftLogs", (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        let startdate = result[0].date;
        let shift = result[0].shift;

        let updatestatus = dictionary.GetValue(dictionary.CLD());
        let data = [updatestatus, posid, startdate];
        let sql_update =
          "update pos_shift_logs set psl_status=? where psl_posid =? and psl_date=?";
        let shift_sales_details = `select 
        st_pos_id as posid,
        st_shift as shift,
        sum(cast(st_total as decimal(10,2))) as total 
        from sales_detail 
        where st_date between '${startdate} 00:00' and '${helper.GetCurrentDate()} 23:59' 
        and st_pos_id = '${posid}'
        and st_shift = '${shift}'`;

        mysql.SelectResult(shift_sales_details, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          let total = result[0].total;
          let shift_report = [total, updatestatus, posid, startdate, shift];
          let update_shift_report =
            "update shift_report set sr_total_sales=?, sr_status=? where sr_pos =? and sr_date=? and sr_shift=?";

          mysql.UpdateMultiple(
            update_shift_report,
            shift_report,
            (err, result) => {
              if (err) console.error("Error: ", err);
              console.log(result);
            }
          );
        });

        mysql.UpdateMultiple(sql_update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      } else {
        res.json({
          msg: "No Shift Found",
        });
      }
    });
  } catch (error) {
    res.json({ msg: error.message });
  }
});
