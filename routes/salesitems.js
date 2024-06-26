var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "productprice");
});
module.exports = router;

router.post("/getshiftitemsold", (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.body;
    let sql = `select 
    case when si_total < 0 then dd_name else mp_description end as item,
    si_price as price,
    SUM(si_quantity) as quantity,
    SUM(si_total) as total from sales_detail
    inner join sales_item on st_detail_id = si_detail_id
    inner join master_product on si_item = mp_productid
    left join sales_discount on sd_detailid = si_detail_id
    left join discounts_details on dd_discountid = sd_discountid
    where st_detail_id between ? and ?
    and st_status='SOLD'
    group by case when si_total < 0 then dd_name else mp_description end,si_price
    order by item asc`;
    let cmd_sql = helper.SelectStatement(sql, [beginingreceipt, endingreceipt]);
    mysql.SelectResult(cmd_sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({
          msg: err,
        });
      }

      if (result.length != 0) {
        let data = [];
        result.forEach((key, item) => {
          data.push({
            item: key.item,
            price: key.price,
            quantity: key.quantity,
            total: key.total,
          });
        });

        console.log(data);
        res.json({
          msg: "success",
          data: data,
        });
      } else {
        res.json({
          msg: "success",
          data: result,
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/getshiftsummarypayment", (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.body;
    let sql = `
    select ca_paymenttype as paymenttype,
    SUM(st_total) as total from sales_detail
    inner join cashier_activity on ca_detailid = st_detail_id
    where st_detail_id between ? and ?
    and st_status='SOLD'
    group by ca_paymenttype`;
    let cmd_sql = helper.SelectStatement(sql, [beginingreceipt, endingreceipt]);
    mysql.SelectResult(cmd_sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({
          msg: err,
        });
      }

      if (result.length != 0) {
        let data = [];
        result.forEach((key, item) => {
          data.push({
            paymenttype: key.paymenttype,
            total: key.total,
          });
        });

        console.log(data);
        res.json({
          msg: "success",
          data: data,
        });
      } else {
        res.json({
          msg: "success",
          data: result,
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/getshiftstaffsales", (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.body;
    let sql = `
    select
    st_cashier as salesstaff,
    sum(st_total) as total
    from sales_detail
    where st_detail_id between ? and ?
    and st_status='SOLD'
    group by st_cashier`;
    let cmd_sql = helper.SelectStatement(sql, [beginingreceipt, endingreceipt]);
    mysql.SelectResult(cmd_sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({
          msg: err,
        });
      }

      if (result.length != 0) {
        let data = [];
        result.forEach((key, item) => {
          data.push({
            salesstaff: key.salesstaff,
            total: key.total,
          });
        });

        console.log(data);
        res.json({
          msg: "success",
          data: data,
        });
      } else {
        res.json({
          msg: "success",
          data: result,
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});
