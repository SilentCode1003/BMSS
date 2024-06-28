var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "shiftreports");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.DND());
    let date = helper.GetCurrentDate();
    let sql = `select * from shift_report order by sr_date desc`;

    mysql.Select(sql, "ShiftReport", (err, result) => {
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
    let date = req.body.date;
    let pos = req.body.pos;
    let shift = req.body.shift;
    let cashier = req.body.cashier;
    let floating = req.body.floating;
    let cashfloat = req.body.cashfloat;
    let salesbeginning = req.body.salesbeginning;
    let salesending = req.body.salesending;
    let totalsales = req.body.totalsales;
    let receiptbeginning = req.body.receiptbeginning;
    let receiptending = req.body.receiptending;
    let status = req.body.pos;
    let approvedby = req.body.approvedby;
    let approveddate = req.body.approveddate;
    let data = [];

    let sql_check = `select * from shift_report where mp_date='${productid}'`;

    mysql.Select(sql_check, "ShiftReport", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          date,
          pos,
          shift,
          cashier,
          floating,
          cashfloat,
          salesbeginning,
          salesending,
          totalsales,
          receiptbeginning,
          receiptending,
          productid,
          description,
          productimage,
          status,
          approvedby,
          approveddate,
        ]);

        mysql.InsertTable("shift_report", data, (err, result) => {
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

router.post("/approve", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.APD());
    let date = req.body.date;
    let posid = req.body.posid;
    let shift = req.body.shift;
    let approvedby = req.session.fullname;
    let approveddate = helper.GetCurrentDatetime();
    let data = [status, approvedby, approveddate, date, posid, shift];
    let sql_update = `update shift_report set sr_status=?, sr_approvedby=?, sr_approveddate=? where sr_date=? and sr_pos=? and sr_shift=?`;

    mysql.UpdateMultiple(sql_update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      res.json({
        msg: "success",
      });
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/getemployeesales", (req, res) => {
  try {
    let cashier = req.body.cashier;
    let daterange = req.body.daterange;
    // console.log(daterange, cashier)

    let [startDate, endDate] = daterange.split(" - ");

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
    st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch
    FROM sales_detail
    INNER JOIN master_branch ON mb_branchid = st_branch
    WHERE st_cashier = '${cashier}'
    AND st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD';`;

    let selectTransactions = `select st_pos_id as posid,
        st_shift as shift,
        me_fullname as employee,
        st_detail_id as ornumber,
        st_date as transactiondate,
        st_total as totalsales,
        st_status as status,
        ca_paymenttype as paymenttype,
      CASE WHEN isnull(ed_referenceid) THEN 'N/A' ELSE ed_referenceid END as paymentreference,
        mb_branchname as branch
      from master_employees
      inner join sales_detail on me_fullname = st_cashier
      inner join master_branch on st_branch = mb_branchid
      left join cashier_activity on st_detail_id = ca_detailid
      left join epayment_details on st_detail_id = ed_detailid
      WHERE st_cashier = '${cashier}' AND st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59'
      order by st_detail_id asc`;

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      const transactionData = result;
      mysql.SelectResult(selectTransactions, (err, result) => {
        if (err) {
          console.log(err);
          return res.json({
            msg: err,
          });
        } else {
          const transactions = result;
          const data = [
            {
              transactions: transactions,
              transactionsData: transactionData,
            },
          ];
          res.json({
            msg: "success",
            data: data,
          });
        }
      });
      // if(result == ''){
      //   console.log("NO DATA!")
      // }else{
      //   console.log(result)
      //   console.log(sql_select)
      // }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/get-sales-details", (req, res) => {
  try {
    let { receiptBeg, receiptEnd } = req.body;

    const selectSales = `SELECT 
        CASE 
            WHEN si_total < 0 THEN dd_name 
            ELSE mp_description 
        END AS item,
        si_price AS price,
        SUM(si_quantity) AS quantity,
        SUM(si_total) AS total,
        mb_branchname AS branch
    FROM sales_detail
    INNER JOIN sales_item ON st_detail_id = si_detail_id
    INNER JOIN master_product ON si_item = mp_productid
    INNER JOIN master_branch ON mb_branchid = st_branch
    LEFT JOIN sales_discount ON sd_detailid = si_detail_id
    LEFT JOIN discounts_details ON dd_discountid = sd_discountid
    WHERE st_detail_id BETWEEN '${receiptBeg}' AND '${receiptEnd}' 
        AND st_status = 'SOLD'
    GROUP BY 
        CASE 
            WHEN si_total < 0 THEN dd_name 
            ELSE mp_description 
        END, 
        si_price,
        mb_branchname;`;

    mysql.SelectResult(selectSales, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      res.json({
        msg: "success",
        data: result,
      });

      if (result == "") {
        console.log("NO DATA!");
      } else {
        console.log(result);
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/getshiftreport", (req, res) => {
  try {
    const { date, posid, shift } = req.body;
    let sql =
      "select * from shift_report where sr_date=? and sr_pos=? and sr_shift=?";
    let cmd_sql = helper.SelectStatement(sql, [date, posid, shift]);

    mysql.Select(cmd_sql, "ShiftReport", (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ msg: err });
      }

      console.log(result);
      res.json({ msg: "success", data: result });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getreport", (req, res) => {
  try {
    const { date, posid } = req.body;
    let status = dictionary.GetValue(dictionary.STR());
    let sql =
      "select * from shift_report where sr_date=? and sr_pos=? and not sr_status=?";
    let cmd = helper.SelectStatement(sql, [date, posid, status]);

    console.log(cmd);
    mysql.SelectResult(cmd, (error, result) => {
      if (error) {
        console.error(error);
        return res.json({ msg: error });
      }

      if (result.length != 0) {
        let data = DataModeling(result, "sr_");

        console.log(data);
        res.json({
          msg: "success",
          data: data,
        });
      } else {
        return res.json({
          msg: "success",
          data: result,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      msg: error,
    });
  }
});
