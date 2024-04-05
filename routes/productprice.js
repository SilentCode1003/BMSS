var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { ProductPriceModel, ProductCategory } = require("./model/model");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "productprice");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT pp_product_price_id as pp_product_price_id, pp_product_id as pp_product_id, pp_description as pp_description, pp_barcode as pp_barcode,
        pp_product_image as pp_product_image, pp_price as pp_price, mc_categoryname as pp_category, pp_previous_price as pp_previous_price,
        pp_price_change as pp_price_change, pp_price_change_date as pp_price_change_date, pp_status as pp_status, pp_createdby as pp_createdby,
        pp_createddate as pp_createddate
      FROM salesinventory.product_price
      INNER JOIN salesinventory.master_category ON mc_categorycode = pp_category`;

    mysql.Select(sql, "ProductPrice", (err, result) => {
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

router.post("/save", (req, res) => {
  try {
    let productid = req.body.productid;
    let description = req.body.desctiption;
    let barcode = req.body.barcode;
    let productimage = req.body.productimage;
    let price = req.body.price;
    let category = req.body.category;
    let previousprice = req.body.previousprice;
    let pricechange = req.body.pricechange;
    let pricechangedate = req.body.pricechangedate;
    let status = req.body.status;
    let createdby = req.body.createdby;
    let createddate = req.body.createddate;
    let data = [];

    let sql_check = `select * from product_price where pp_product_id='${productid}'`;

    mysql.Select(sql_check, "ProductPrice", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          productid,
          description,
          barcode,
          productimage,
          price,
          category,
          previousprice,
          pricechange,
          pricechangedate,
          status,
          createdby,
          createddate,
        ]);

        mysql.InsertTable("product_price", data, (err, result) => {
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

router.post("/getcategory", (req, res) => {
  try {
    const category = req.body.category;
    const branchid = req.body.branchid;
    const data = [];

    // let sql = `SELECT * FROM product_price WHERE pp_category = '${category}'`;
    let sql = `SELECT
    pp_product_id as productid,
    pp_barcode as barcode,
    pp_product_image as productimage,
    pp_price as price,
    pp_category as category,
    pp_description as description,
    pi_quantity as quantity
    FROM product_price
    inner join product_inventory on pp_product_id = pi_productid
    WHERE pp_category = '${category}'
    and pi_branchid = '${branchid}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      let productPriceJson = helper.ConvertToJson(result);
      let productPriceModel = productPriceJson.map(
        (data) =>
          new ProductCategory(
            data["productid"],
            data["description"],
            data["barcode"],
            data["productimage"],
            data["price"],
            data["category"],
            data["quantity"]
          )
      );

      productPriceModel.forEach((key, index) => {
        data.push({
          productid: key.productid,
          description: key.description,
          barcode: key.barcode,
          productimage: key.productimage,
          price: key.price,
          category: key.category,
          quantity: key.quantity,
        });
      });

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

router.post("/getprice", (req, res) => {
  try {
    const { barcode, branchid } = req.body;

    const price = [];

    let sql = `SELECT
    pp_description as description,
    pp_price as price,
    pi_quantity as quantity
    FROM product_price
    INNER JOIN product_inventory ON pi_productid = pp_product_id
    WHERE pp_barcode = '${barcode}'
    AND pi_branchid = '${branchid}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      console.log(result);

      // let productPriceJson = helper.ConvertToJson(result);
      // let productPriceModel = productPriceJson.map(
      //   (data) =>
      //     new ProductPriceModel(
      //       data["productpriceid"],
      //       data["productid"],
      //       data["description"],
      //       data["barcode"],
      //       data["productimage"],
      //       data["price"],
      //       data["category"],
      //       data["previousprice"],
      //       data["pricechange"],
      //       data["pricechangedate"],
      //       data["status"],
      //       data["createdby"],
      //       data["createddate"]
      //     )
      // );

      result.forEach((key, index) => {
        price.push({
          description: key.description,
          price: parseFloat(key.price),
          quantity: key.quantity,
        });
      });

      res.json({
        msg: "success",
        data: price,
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
    let id = req.body.id;
    let price = req.body.price;
    let change_Date = helper.GetCurrentDatetime();
    // console.log(id, price, change_Date);

    let sql_Update = `UPDATE product_price 
                       SET pp_price = ?,
                       pp_previous_price = ?,
                       pp_price_change_date = ?
                       WHERE pp_product_id = ?`;

    let sql_check = `SELECT * FROM product_price WHERE pp_product_id='${id}'`;

    let select_MProduct = `SELECT * FROM master_product WHERE mp_productid='${id}'`;
    let update_MProduct = `UPDATE master_product 
                            SET mp_price = ?
                            WHERE mp_productid = ?`;
    let Mproduct_data = [price, id];

    mysql.Select(sql_check, "ProductPrice", (err, result) => {
      if (err) console.error("Error: ", err);
      let previousprice = result[0].price;
      let data = [price, previousprice, change_Date, id];
      // console.log(data, "Price change data");

      mysql.UpdateMultiple(sql_Update, data, (err, result) => {
        if (err) console.error("Error: ", err);

        mysql.Select(select_MProduct, "MasterProduct", (err, result) => {
          if (err) console.error("Error: ", err);

          mysql.UpdateMultiple(
            update_MProduct,
            Mproduct_data,
            (err, result) => {
              if (err) console.error("Error: ", err);

              // console.log(result);

              let loglevel = dictionary.INF();
              let source = dictionary.SALES();
              let message = `${dictionary.GetValue(
                dictionary.UPDT()
              )} -  [${sql_Update}]`;
              let user = req.session.employeeid;

              Logger(loglevel, source, message, user);

              res.json({
                msg: "success",
              });
            }
          );
        });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
