var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "products");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `
        SELECT 
            mp_productid as productid, mp_description as description, mp_price as price, mc_categoryname as category, 
            mp_barcode as barcode, mp_status as status, mp_createdby as createdby, 
            mp_createddate as createddate, mp_cost as cost, mp_productimage as productimage
        FROM master_product
        INNER JOIN master_category on mp_category = mc_categorycode
        ORDER BY mp_productid DESC;`;

    mysql.SelectResult(sql, (err, result) => {
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

router.get("/inventory", (req, res) => {
  try {
    let sql = ` SELECT 
                mp_productid AS id,
                mp_description AS productname,
                mp_price AS price,
                mc_categoryname AS category,
                mp_cost AS cost,
                SUM(pi.pi_quantity) AS stocks
            FROM master_product mp
            INNER JOIN master_category mc ON mp.mp_category = mc.mc_categorycode
            INNER JOIN product_inventory pi ON mp.mp_productid = pi.pi_productid
            GROUP BY mp.mp_productid
            ORDER BY mp.mp_productid DESC;`;

    mysql.SelectResult(sql, (err, result) => {
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

router.post("/image", (req, res) => {
  try {
    let id = req.body.productid;
    let sql = `SELECT mp_productimage as productimage FROM master_product WHERE mp_productid = '${id}';`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      console.log("Query: " + sql);
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

router.post("/all/images", (req, res) => {
  try {
    let sql = `SELECT mp_productid as id, mp_productimage as image FROM master_product`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      console.log("Query: " + sql);
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
    let description = req.body.description;
    let price = req.body.price;
    let productimage = req.body.productimage;
    let barcode = req.body.barcode;
    let category = req.body.category;
    let cost = req.body.cost ? req.body.cost : 0.0;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.body.fullname
      ? req.body.fullname
      : req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let quantity = 0;
    let productid = "";
    let previousprice = "";
    let pricechange = "";
    let pricechangedate = "";
    let dataproductprice = [];
    let datacategory = [];
    let branchid = [];
    let data = [];

    let sampleData = {
      description: description,
      price: price,
      productimage: productimage,
      barcode: barcode,
      category: category,
      cost: cost,
      status: status,
      createdby: createdby,
      createdate: createdate,
    };

    console.log(sampleData);

    let select_branch = `select * from master_branch`;

    mysql.Select(select_branch, "MasterBranch", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      result.forEach((item, index) => {
        let id = item.branchid;
        branchid.push(id);
      });

      console.log(helper.GetCurrentDatetime());
    });

    // let check_category = `select * from master_category where mc_categorycode='${category}'`;
    // mysql.Select(check_category, "MasterPositionType", (err, result) => {
    //     if (err) console.error("Error: ", err);

    //     if (result.length != 0) {
    //     } else {
    //           datacategory.push([
    //               category,
    //               status,
    //               createdby,
    //               createdate
    //           ]);

    //           mysql.InsertTable("master_category", datacategory, (err, result) => {
    //             if (err) console.error("Error: ", err);
    //           });
    //     }
    // });

    //#region GENERAL SAVE
    let sql_check = `select * from master_product where mp_description='${description}'`;
    mysql.Select(sql_check, "MasterProduct", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          description,
          price,
          category,
          barcode,
          productimage,
          status,
          createdby,
          createdate,
          cost,
        ]);

        mysql.InsertTable("master_product", data, (err, result) => {
          if (err) console.error("Error: ", err);
          productid = result[0]["id"];
          // console.log(productid);

          branchid.forEach((branchId) => {
            let inventoryid = productid + branchId;
            let check_inventory = `SELECT * FROM product_inventory WHERE pi_productid='${productid}' AND pi_branchid='${branchId}'`;

            mysql.Select(check_inventory, "ProductInventory", (err, result) => {
              if (err) {
                console.error("Error: ", err);
              } else {
                if (result.length !== 0) {
                  console.log(
                    `Product Exists: ${productid} and branchid: ${branchId}`
                  );
                } else {
                  let productinventory = [
                    [inventoryid, productid, branchId, quantity, category],
                  ];

                  mysql.InsertTable(
                    "product_inventory",
                    productinventory,
                    (err, result) => {
                      if (err) {
                        console.error("Error: ", err);
                      } else {
                        console.log(
                          `Product inventory added for productid: ${productid} and branchid: ${branchId}`
                        );
                        let loglevel = dictionary.INF();
                        let source = dictionary.MSTR();
                        let message = `${dictionary.GetValue(
                          dictionary.INSD()
                        )} -  [Product Inventory] [ID: ${inventoryid}, Product ID: ${productid}, Branch: ${branchId}, Quantity: ${quantity}]`;
                        let user = req.session.employeeid;

                        Logger(loglevel, source, message, user);
                      }
                    }
                  );
                }
              }
            });
          });

          let check_data = `select * from product_price where pp_product_id='${productid}'`;
          mysql.Select(check_data, "ProductPrice", (err, result) => {
            if (err) console.error("Error: ", err);

            if (result.length != 0) {
            } else {
              dataproductprice.push([
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
                createdate,
              ]);

              mysql.InsertTable(
                "product_price",
                dataproductprice,
                (err, result) => {
                  if (err) console.error("Error: ", err);
                  let id = result[0].id;
                  let loglevel = dictionary.INF();
                  let source = dictionary.MSTR();
                  let message = `${dictionary.GetValue(
                    dictionary.INSD()
                  )} -  [Product Price] [ID:${id}, Product ID:${productid}, Name:${description}]`;
                  let user = createdby ? createdby : req.session.employeeid;

                  Logger(loglevel, source, message, user);
                }
              );
            }
          });

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.INSD()
          )} -  [${"Master Products"}]`;
          let user = createdby ? createdby : req.session.employeeid;

          Logger(loglevel, source, message, user);

          res.json({
            msg: "success",
            data: result,
          });
        });
      }
    });
    //#endregion
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/status", (req, res) => {
  try {
    let productid = req.body.productid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, productid];
    console.log(data);

    let sql_Update = `UPDATE master_product 
                    SET mp_status = ?
                    WHERE mp_productid = ?`;

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      let loglevel = dictionary.INF();
      let source = dictionary.MSTR();
      let message = `${dictionary.GetValue(
        dictionary.UPDT()
      )} -  [${sql_Update}]`;
      let user = req.session.employeeid;

      Logger(loglevel, source, message, user);

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

router.post("/edit", (req, res) => {
  try {
    let productid = req.body.productid;
    let description = req.body.description;
    let productimage = req.body.productimage;
    let barcode = req.body.barcode;
    let category = req.body.category;

    let data = [];
    let sql_Update = `UPDATE master_product 
                    SET`;

    if (description) {
      sql_Update += ` mp_description = ?,`;
      data.push(description);
    }

    if (productimage) {
      sql_Update += ` mp_productimage = ?,`;
      data.push(productimage);
    }

    if (barcode) {
      sql_Update += ` mp_barcode = ?,`;
      data.push(barcode);
    }

    if (category) {
      sql_Update += ` mp_category = ?,`;
      data.push(category);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE mp_productid = ?;`;
    data.push(productid);

    let sql_check = `SELECT * FROM master_product WHERE mp_description='${description}'`;

    let sql_Update_product_price = `UPDATE product_price 
                                    SET`;

    if (description) {
      sql_Update_product_price += ` pp_description = ?,`;
      data.push(description);
    }

    if (productimage) {
      sql_Update_product_price += ` pp_product_image = ?,`;
      data.push(productimage);
    }

    if (barcode) {
      sql_Update_product_price += ` pp_barcode = ?,`;
      data.push(description);
    }

    if (category) {
      sql_Update_product_price += ` pp_category = ?,`;
      data.push(category);
    }

    sql_Update_product_price = sql_Update_product_price.slice(0, -1);
    sql_Update_product_price += ` WHERE pp_product_id = ?;`;
    data.push(productid);

    mysql.Select(sql_check, "MasterProduct", (err, result) => {
      if (err) {
        console.error("Error: ", err);
        return res.json({
          msg: "error",
        });
      }

      if (result.length === 1) {
        return res.json({
          msg: "duplicate",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);
          console.log(result);
          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.UPDT()
          )} -  [${sql_Update}]`;
          let user = req.session.employeeid;

          Logger(loglevel, source, message, user);
        });

        mysql.UpdateMultiple(sql_Update_product_price, data, (err, result) => {
          if (err) console.error("Error: ", err);
          console.log(result);
          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.UPDT()
          )} -  [${sql_Update_product_price}]`;
          let user = req.session.employeeid;

          Logger(loglevel, source, message, user);
        });

        res.json({
          msg: "success",
        });
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
    });
  }
});

router.post("/getproduct", (req, res) => {
  try {
    let description = req.body.description;
    let sql = `select mp_productid, mp_description from master_product where mp_description = '${description}'`;

    mysql.Select(sql, "MasterProduct", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }
      console.log(result, sql);
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

router.get("/getproductdetails", (req, res) => {
  try {
    let productid = req.query.productid;
    // console.log(productid)
    let sql = `select * from master_product where mp_productid = '${productid}'`;

    mysql.Select(sql, "MasterProduct", (err, result) => {
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

router.post("/getproductbycategory", (req, res) => {
  try {
    let branchid = req.session.branchid;
    let category = req.body.category;

    let sql = `SELECT pi_productid as productid, pi_branchid as branchid, mp_description as productname, 
                mp_price as price, mp_category as category, pi_quantity as currentstock
                FROM product_inventory AS pi
                INNER JOIN master_product AS mp
                ON pi.pi_productid = mp.mp_productid WHERE pi_branchid = '${branchid}' AND mp_category = '${category}'; `;

    mysql.SelectResult(sql, (err, result) => {
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

router.post("/getbyproductname", (req, res) => {
  try {
    let branchid = req.session.branchid;
    let productid = req.body.productid;

    let sql = `SELECT pi_productid as productid, pi_branchid as branchid, 
                mp_price as price, mp_category as category, pi_quantity as currentstock
                FROM product_inventory AS pi
                INNER JOIN master_product AS mp
                ON pi.pi_productid = mp.mp_productid WHERE pi_branchid = '${branchid}' AND mp_productid = '${productid}'; `;

    mysql.SelectResult(sql, (err, result) => {
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
