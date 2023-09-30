var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("salesdetails", {
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

router.post("/load", (req, res) => {
  try {
    const shift = req.body.shift;
    const dateRange = req.body.dateRange;
    const posid = req.body.posid;

    let sql = `SELECT * FROM sales_detail`;

    if (shift || dateRange || posid) {
      sql += " WHERE ";

      const conditions = [];

      if (shift) {
        conditions.push(`st_shift = ${shift}`);
      }

      if (dateRange) {
        const [startDate, endDate] = dateRange.split(" to ");
        conditions.push(
          `st_date BETWEEN '${startDate} 00:00' AND '${endDate} 23:59'`
        );
      }

      if (posid) {
        conditions.push(`st_pos_id = ${posid}`);
      }

      sql += conditions.join(" AND ");
    }

    console.log(sql);

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
    let referenceid = req.body.referenceid;
    let paymentname = req.body.paymentname;
    let description = req.body.description;
    let total = req.body.total;
    let cashier = req.body.cashier;
    let cash = req.body.cash;
    let ecash = req.body.ecash;
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
          let activity = [];
          let items = [];
          let detail_description = JSON.parse(description);
          detail_description.forEach((key, item) => {
            let itemname = key.name;
            let price = parseFloat(key.price);
            let quantity = parseFloat(key.quantity);
            let total = price * quantity;
            items.push([detailid, date, itemname, price, quantity, total]);
          });

          mysql.InsertTable("sales_item", items, (err, result) => {
            if (err) console.error("Error:)", err);
            console.log(result);
          });

          activity.push([
            detailid,
            paymenttype == "SPLIT" ? "Cash" : paymenttype,
            cash,
            date,
          ]);

          if (paymenttype === "SPLIT") {
            activity.push([detailid, paymentname, ecash, date]);
          }

          mysql.InsertTable("cashier_activity", activity, (err, result) => {
            if (err) console.error("Error: ", err);
            console.log(result);
          });

          if (paymenttype != "CASH") {
            let paymentdetails = [[detailid, paymentname, referenceid, date]];

            mysql.InsertTable(
              "epayment_details",
              paymentdetails,
              (err, result) => {
                if (err) console.error("Error: ", err);
                console.log(result);
              }
            );
          }

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
    let receipt = `${posid}00000000`;

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
          data: receipt,
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getdetails", (req, res) => {
  try {
    const detailid = req.body.detailid;

    let sql = `select
    st_detail_id as ornumber,
    st_date as ordate,
    st_description as ordescription,
    st_payment_type as orpaymenttype,
    st_pos_id as posid,
    st_shift as shift,
    st_cashier as cashier,
    st_total as total,
    ed_type as epaymentname,
    ed_referenceid as referenceid,
    ca_paymenttype as  paymentmethod,
    ca_amount as amount
    from sales_detail
    left join epayment_details on sales_detail.st_detail_id = epayment_details.ed_detailid
    left join cashier_activity on sales_detail.st_detail_id = cashier_activity.ca_detailid
    where st_detail_id='${detailid}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
          data: result,
        });
      }
      let data = [];
      result.forEach((key, item) => {
        data.push({
          ornumber: key.ornumber,
          ordate: key.ordate,
          ordescription: key.ordescription,
          orpaymenttype: key.orpaymenttype,
          posid: key.posid,
          shift: key.shift,
          cashier: key.cashier,
          total: key.total,
          epaymentname: key.epaymentname == null ? "" : key.epaymentname,
          referenceid: key.referenceid == null ? "" : key.referenceid,
          paymentmethod: key.paymentmethod,
          amount: key.amount,
        });
      });

      console.log(data);
      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
      data: "",
    });
  }
});

router.post("/getdescription", (req, res) => {
  try {
    let chartFilter = req.body.chartfilter;
    let currentMonth = helper.GetCurrentMonth();
    let filter = "";

    let sql_select = `SELECT st_description FROM sales_detail WHERE `;

    if (chartFilter === "daily") {
      filter = helper.GetCurrentDate();
      sql_select += `DATE(st_date) = '${filter}'`;
      console.log(sql_select);
    } else if (chartFilter === "monthly") {
      filter = helper.GetCurrentYear();
      sql_select += `YEAR(st_date) = '${filter}' AND MONTH(st_date) = '${currentMonth}'`;
      console.log(sql_select);
    } else if (chartFilter === "yearly") {
      filter = helper.GetCurrentYear();
      sql_select += `YEAR(st_date) = '${filter}'`;
      console.log(sql_select);
    }

    mysql.SelectResult(sql_select, (err, result) => {
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

router.get("/yearly", (req, res) => {
  try {
    let sql = `SELECT MONTH(st_date) as month, YEAR(st_date) as year, st_branch, SUM(CAST(st_total AS DECIMAL(10, 2))) AS total
      FROM sales_detail
      GROUP BY YEAR(st_date), MONTH(st_date), st_branch, st_description
      ORDER BY YEAR(st_date), MONTH(st_date), st_branch, st_description;`;

    mysql.SelectResult(sql, (err, result) => {
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
