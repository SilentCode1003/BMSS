var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("salesdetails", {
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
    const shift = req.query.shift;
    const dateRange = req.query.dateRange;
    const posid = req.query.posid;

    let sql = `SELECT * FROM sales_detail`;

    if (shift || dateRange || posid) {
      sql += " WHERE ";

      const conditions = [];

      if (shift) {
        conditions.push(`st_shift = ${shift}`);
      }

      if (dateRange) {
        const [startDate, endDate] = dateRange.split(" to ");
        conditions.push(`st_date BETWEEN '${startDate}' AND '${endDate}'`);
      }

      if (posid) {
        conditions.push(`st_pos_id = ${posid}`);
      }

      sql += conditions.join(" AND ");
    }

    mysql.Select(sql, "SalesDetail", (err, result) => {
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
    let detailid = req.body.detailid;
    let date = req.body.date;
    let posid = req.body.posid;
    let shift = req.body.shift;
    let paymenttype = req.body.paymenttype;
    let description = req.body.description;
    let total = req.body.total;
    let cashier = req.body.cashier;
    let data = [];

    let sql_check = `select * from sales_detail where st_detail_id='${detailid}'`;

    mysql.Select(sql_check, "SalesDetail", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          detailid,
          date,
          posid,
          shift,
          paymenttype,
          description,
          total,
          cashier,
        ]);

        mysql.InsertTable("sales_detail", data, (err, result) => {
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

router.post("/getdetailid", (req, res) => {
  try {
    let posid = req.body.posid;
    let sql = `select st_detail_id as detailid from sales_detail where st_pos_id='${posid}' order by st_detail_id desc limit 1`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        res.json({
          msg: "success",
          data: result[0].detailid,
        });
      } else {
        res.json({
          msg: "success",
          data: 100000000,
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getDetails", (req, res) => {
  try {
    const detailid = req.body.detailid;

    let sql = `SELECT * FROM sales_detail WHERE st_detail_id = '${detailid}'`;

    mysql.Select(sql, "SalesDetail", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
          data: result,
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
      data: "",
    });
  }
});

router.get("/getdescription", (req, res) => {
  try {
    let currentDate = helper.GetCurrentDate();
    let sql = `SELECT st_description
      FROM sales_detail
      WHERE DATE(st_date) = '${currentDate}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      //console.log(result);
      res.json({
        msg: "success",
        data: result,
      });
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});
