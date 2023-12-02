var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { error } = require("winston");
const { Validator } = require("./controller/middleware");

/* GET home page. */

router.get("/", function (req, res, next) {
  Validator(req, res, "discount");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `select * from discounts_details`;

    mysql.Select(sql, "DiscountDetails", (err, result) => {
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

router.post("/save", (req, res) => {
  try {
    let discountname = req.body.discountname;
    let description = req.body.description;
    let rate = req.body.rate;
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let discounts_details = [
      [discountname, description, rate, status, createdby, createddate],
    ];

    mysql.InsertTable("discounts_details", discounts_details, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result.discount);

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

router.post("/status", (req, res) => {
  try {
    let discountid = req.body.discountid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, discountid];
    console.log(data);

    let sql_Update = `UPDATE discounts_details 
                       SET dd_status = ?
                       WHERE dd_discountid = ?`;

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
    let discountname = req.body.discountname;
    let discountid = req.body.discountid;
    let description = req.body.description;
    let rate = req.body.rate;

    let data = [];

    let sql_Update = `UPDATE discounts_details SET`;

    if (discountname) {
      sql_Update += ` dd_name = ?,`;
      data.push(discountname);
    }

    if (description) {
      sql_Update += ` dd_description = ?,`;
      data.push(description);
    }

    if (rate) {
      sql_Update += ` dd_rate = ?,`;
      data.push(rate);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE dd_discountid = ?;`;
    data.push(discountid);

    let sql_check = `SELECT * FROM discounts_details WHERE dd_discountid = '${discountid}'`;

    mysql.Select(sql_check, "DiscountDetails", (err, result) => {
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
          if (err) {
            console.error("Error: ", err);
            return res.json({
              msg: "error",
            });
          }
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

router.post("/getactive", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let name = req.body.name;
    let sql = `select * from discounts_details where dd_status='${status}' and dd_name='${name}'`;

    mysql.Select(sql, "DiscountDetails", (err, result) => {
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

router.post("/salesdiscount", (req, res) => {
  try {
    let detailid = req.body.detailid;
    let discountid = req.body.discountid;
    let customerinfo = req.body.customerinfo;
    let amount = req.body.amount;
    let sales_discount = [[detailid, discountid, customerinfo, amount]];

    mysql.InsertTable("sales_discount", sales_discount, (err, result) => {
      if (err) console.error("Error: ", err);

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
