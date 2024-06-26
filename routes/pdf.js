var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");
const { Generate, shiftreport } = require("./repository/pdf");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "pdf");
});

module.exports = router;

let pdfBuffer = "";
let filename = "";
let currentDate = "";

router.post("/processpdfdata", (req, res) => {
  try {
    const data = req.body.processeddata;
    const { template, category, date, branch, employee, transactions } =
      req.body;
    console.log(transactions);
    if (data.length != 0 && data != undefined) {
      Generate(data, template, category, date, branch, employee, transactions)
        .then((result) => {
          pdfBuffer = result;
          filename = template;
          currentDate = helper.GetCurrentDatetime();

          res.json({
            msg: "success",
            data: result,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.json({
            msg: error,
          });
        });
    } else {
      res.json({
        msg: "nodata",
      });
    }
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/processshiftreports", (req, res) => {
  try {
    let data = req.body.processeddata;
    let { template, date, pos, shift, cashier, branch } = req.body;
    console.log(data, template, date, pos, shift, cashier, branch);
    if (data.length != 0 && data != undefined) {
      shiftreport(data, template, date, pos, shift, cashier, branch)
        .then((result) => {
          pdfBuffer = result;
          filename = template;
          currentDate = helper.GetCurrentDatetime();

          res.json({
            msg: "success",
            data: result,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.json({
            msg: error,
          });
        });
    } else {
      res.json({
        msg: "nodata",
      });
    }
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.get("/generatepdf", (req, res) => {
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}_${currentDate}.pdf`
    );

    res.send(pdfBuffer);
  } catch (error) {
    res.json({
      msg: error,
    });
    console.log(error);
  }
});
