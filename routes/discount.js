var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { error } = require("winston");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("discount", {
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

    

  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
