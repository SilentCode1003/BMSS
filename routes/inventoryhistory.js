var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const {
  SelectStatement,
  UpdateStatement,
  InsertStatement,
} = require("./repository/customhelper");
const { DataModeling } = require("./model/bmssmodel");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "inventoryhistory");
});

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT * FROM inventory_history`;

    mysql.Select(sql, "InventoryHistory", (err, result) => {
      if (err) {
        console.log(err);
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

router.get("/history", (req, res) => {
  try {
    let sql = `SELECT * FROM history`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return (
          res.status(400),
          res.json({
            msg: err,
          })
        );
      }
      const data = DataModeling(result, "h_");
      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

module.exports = router;
