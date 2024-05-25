var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "stockadjustment");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `select * from master_access_type`;

    mysql.Select(sql, "MasterAccessType", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      // console.log(helper.GetCurrentDatetime());
      // console.log(result);
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
