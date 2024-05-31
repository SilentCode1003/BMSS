const express = require("express");
const router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");
const { InsertStatement } = require("./repository/customhelper");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "stockadjustment");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    const sql = `SELECT sad_id, mb_branchname AS sad_branchname, sad_branchid, sad_createddate, me_fullname as sad_createdby, sad_status 
    FROM stock_adjustment_detail
    INNER JOIN master_branch ON sad_branchid = mb_branchid
    INNER JOIN master_employees ON sad_createdby = me_employeeid`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      const data = DataModeling(result, "sad_");
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

router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;

    const adjustmentDetail = `SELECT sad_id, mb_branchname AS sad_branchid, sad_details, sad_reason, sad_createddate, me_fullname as sad_createdby, sad_notes, sad_status 
      FROM stock_adjustment_detail
      INNER JOIN master_branch ON sad_branchid = mb_branchid
      INNER JOIN master_employees ON sad_createdby = me_employeeid
      WHERE sad_id = ${id}`;

    const adjustmentItems = `SELECT sai_id, sai_detailid, mp_description as sai_productname, mp_productid as sai_productid, sai_quantity, sai_stockafter AS stockafter FROM stock_adjustment_item
      INNER JOIN master_product ON mp_productid = sai_productid
      WHERE sai_detailid = ${id}`;

    mysql.SelectResult(adjustmentDetail, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      const details = DataModeling(result, "sad_");
      mysql.SelectResult(adjustmentItems, (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          });
        }
        const items = DataModeling(result, "sai_");
        res.json({
          msg: "success",
          data: { details, items },
        });
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
    const { branch, reason, details, notes, adjustmentData } = req.body;
    // res.status(200), res.json({ data: adjustmentData });

    if (!branch || !reason || !details || !notes || !adjustmentData) {
      res.status(400), res.json({ msg: "All fields are required" });
    }

    const status = dictionary.GetValue(dictionary.PND());
    const createdby = req.session.employeeid ? req.session.employeeid : 200000;
    const createddate = helper.GetCurrentDatetime();
    let logdata = [];
    let data = [];

    const insertQuery = InsertStatement("stock_adjustment_detail", "sad", [
      "branchid",
      "details",
      "reason",
      "createddate",
      "createdby",
      "notes",
      "status",
    ]);

    data.push([branch, details, reason, createddate, createdby, notes, status]);
    // console.log(insertQuery);
    mysql.InsertDynamic(insertQuery, data, (err, result) => {
      if (err) console.log("Error: ", err);
      let loglevel = dictionary.INF();
      let source = dictionary.INV();
      let message = `${dictionary.GetValue(dictionary.INSD())} -  [${data}]`;
      let user = req.session.employeeid ? req.session.employeeid : 200000;

      Logger(loglevel, source, message, user);

      const id = result[0].id;

      const insertAdjustmentItems = InsertStatement(
        "stock_adjustment_item",
        "sai",
        ["detailid", "productid", "quantity", "stockafter"]
      );

      adjustmentData.forEach((row) => {
        const { productid, quantity } = row;
        const adjustmentItems = [
          [id, parseInt(productid), parseInt(quantity), 0],
        ];

        mysql.InsertDynamic(
          insertAdjustmentItems,
          adjustmentItems,
          (err, result) => {
            if (err) {
              console.error("Error: ", err);
            }
          }
        );
      });

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

router.patch("/approve", (req, res) => {
  try {
    const { adjustmentId, branch } = req.body;
    if (!adjustmentId || !branch) {
      res.status(400), res.json({ msg: "All fields are required" });
    }

    const selectItems = `SELECT * FROM stock_adjustment_item WHERE sai_detailid = '${adjustmentId}'`;

    mysql.SelectResult(selectItems, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      const data = DataModeling(result, "sai_");
      data.forEach((row) => {
        const { productid, quantity } = row;
        const selectInventory = `SELECT * FROM product_inventory WHERE pi_inventoryid = '${productid}${branch}'`;

        mysql.SelectResult(selectInventory, (err, result) => {
          if (err) {
            return res.json({
              msg: err,
            });
          }
          const data = DataModeling(result, "pi_");

          console.log(`inventory Data of productid: ${productid} `, data);
          const currentQuantity = data[0].quantity;
          const newQuantity = parseInt(currentQuantity) + parseInt(quantity);
          console.log(`New Quantity:`, newQuantity);

          const updateInventory = helper.UpdateStatement(
            "product_inventory",
            "pi",
            ["quantity"],
            ["inventoryid"]
          );
          const inventoryData = [newQuantity, `${productid}${branch}`];

          console.log("To be updated:", updateInventory, inventoryData);

          mysql.UpdateMultiple(
            updateInventory,
            inventoryData,
            (err, result) => {
              if (err) {
                console.error("Error: ", err);
                res.status(400);
              }
            }
          );

          const updateAdjustmentStock = helper.UpdateStatement(
            "stock_adjustment_item",
            "sai",
            ["stockafter"],
            ["detailid"]
          );
          const adjustmentStockData = [newQuantity, adjustmentId];

          mysql.UpdateMultiple(
            updateAdjustmentStock,
            adjustmentStockData,
            (err, result) => {
              if (err) {
                console.error("Error: ", err);
                res.status(400);
              }
            }
          );
        });
      });
      const updateAdjustmentStatus = helper.UpdateStatement(
        "stock_adjustment_detail",
        "sad",
        ["status"],
        ["id"]
      );
      const adjustmentStatusData = [
        dictionary.GetValue(dictionary.CMP()),
        adjustmentId,
      ];
      mysql.UpdateMultiple(
        updateAdjustmentStatus,
        adjustmentStatusData,
        (err, result) => {
          if (err) {
            console.error("Error: ", err);
            res.status(400);
          }
        }
      );
      res.status(200), res.json({ msg: "success" });
    });
  } catch (err) {
    console.log(err);
    res.status(400), res.json({ msg: "error" });
  }
});
