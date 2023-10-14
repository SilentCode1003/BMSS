var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { ProductPriceModel, ProductCategory } = require("./model/model");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("productprice", {
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
    let sql = `select * from product_price`;

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
    const barcode = req.body.barcode;
    const price = [];

    let sql = `SELECT * FROM product_price WHERE pp_barcode = '${barcode}'`;

    mysql.Select(sql, "ProductPrice", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      let productPriceJson = helper.ConvertToJson(result);
      let productPriceModel = productPriceJson.map(
        (data) =>
          new ProductPriceModel(
            data["productpriceid"],
            data["productid"],
            data["description"],
            data["barcode"],
            data["productimage"],
            data["price"],
            data["category"],
            data["previousprice"],
            data["pricechange"],
            data["pricechangedate"],
            data["status"],
            data["createdby"],
            data["createddate"]
          )
      );

      productPriceModel.forEach((key, index) => {
        price.push({
          description: key.description,
          price: key.price,
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
