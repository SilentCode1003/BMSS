var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { error } = require("winston");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("promo", {
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
    employeeid: req.session.employeeid,
    branchid: req.session.branchid,
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
    let sql = `select * from promo_details`;

    mysql.Select(sql, "PromoDetails", (err, result) => {
      if (err) console.error("Error: " + err);

      console.log(result);

      res.json({
        msg: "success",
        data: result,
      });
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/save", (req, res) => {
  try {
    let promoname = req.body.promoname;
    let description = req.body.description;
    let dtipermit = req.body.dtipermit;
    let condition = req.body.condition;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    let promo_details = [];
    let sql_check = `select * from promo_details where not pd_status='EXPIRED'`;

    promo_details.push([
      promoname,
      description,
      dtipermit,
      condition,
      startdate,
      enddate,
      status,
      createdby,
      createddate,
    ]);

    console.log(promo_details);

    mysql.SelectResult(sql_check, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        return res.json({
          msg: "existing",
        });
      } else {
        mysql.InsertTable("promo_details", promo_details, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});
