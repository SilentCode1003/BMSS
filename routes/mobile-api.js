var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "mobile-api");
});

module.exports = router;

//DASHBOARD
router.post("/yearlysales", (req, res) => {
  try {
    let details = [
      {
        GrossSales: 0,
        Discounts: 0,
        NetSales: 0,
        Refunds: 0,
        GrossProfit: 0,
      },
    ];

    let { daterange, branch } = req.body;

    let sql_select = `SELECT st_description as description, st_detail_id as detailid, st_total as total
    FROM sales_detail
    WHERE YEAR(st_date) = '${daterange}' AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    mysql.SelectResult(sql_select, async (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      let NetSales = 0;
      let GrossProfit = 0;
      let GrossSales = 0;
      let Discounts = 0;
      let Refunds = 0;

      if (result.length != 0) {
        const executeQuery = (query) => {
          return new Promise((resolve, reject) => {
            mysql.SelectResult(query, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        };

        for (let rowData of result) {
          let detailid = rowData.detailid;
          let total = rowData.total * -1;

          let getRefund = `SELECT * FROM refund WHERE r_detailid = ${detailid}`;
          await executeQuery(getRefund)
            .then((refundResult) => {
              if (refundResult.length != 0) {
                Refunds += total;
              }
            })
            .catch((err) => {
              console.error("Error: ", err);
              res.json({
                msg: "error",
                error: err,
              });
            });

          let descriptionJson = JSON.parse(rowData.description);

          for (let item of descriptionJson) {
            let productname = item.name;
            let totalPrice = parseFloat(item.price) * parseFloat(item.quantity);

            let select_product = `SELECT mp_cost as cost FROM master_product WHERE mp_description = '${productname}'`;

            try {
              const queryResult = await executeQuery(select_product);
              if (queryResult.length != 0 && queryResult[0].cost != null) {
                let cost = parseFloat(queryResult[0].cost).toFixed(2);
                let totalCost = cost * parseFloat(item.quantity).toFixed(2);
                let difference = parseFloat(totalPrice).toFixed(2) - parseFloat(totalCost).toFixed(2);

                GrossSales += totalPrice;
                GrossProfit += difference;
              } else {
                Discounts += totalPrice;
                GrossProfit += totalPrice;
              }
            } catch (err) {
              console.error(err);
            }
          }
        }

        NetSales = GrossSales + (Discounts + Refunds);
        details = [
          {
            GrossSales: GrossSales,
            Discounts: Discounts,
            NetSales: NetSales,
            Refunds: Refunds,
            GrossProfit: GrossProfit + Refunds,
          },
        ];
        res.json({
          msg: "success",
          data: details,
        });
      } else {
        res.json({
          msg: "success",
          data: details,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/yearly-graph", (req, res) => {
  try {
    let { daterange, branch } = req.body;

    let sql_select = `
    SELECT DATE_FORMAT(st_date, '%m-%Y') AS date, SUM(st_total) AS total
    FROM sales_detail
    WHERE YEAR(st_date) = '${daterange}'
        AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

     sql_select += ` GROUP BY DATE_FORMAT(st_date, '%m-%Y');`;
    
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }
      res.json({
        msg: "success",
        data: result,
      });
      if (result == "") {
        console.log("NO DATA!");
      } else {
        // console.log(sql_select);
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/year-topseller", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let activeDiscounts = [];

    let sql_select = `
        SELECT st_description
        FROM sales_detail
        WHERE YEAR(st_date) = '${daterange}' AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`;

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount);
      });
    });

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      // const tableData = {
      //   tableDetails: sortedProducts,
      //   totalPrice: overallTotalPrice
      // }

      let data = GraphData(result, activeDiscounts);


      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/top-employee", (req, res) => {
  try {
    let { daterange, branch } = req.body; // Extracting branch from request body

    let sql_select = `
      SELECT YEAR(MIN(st_date)) as date, SUM(st_total) as total, st_cashier as employee
      FROM sales_detail
      WHERE YEAR(st_date) = '${daterange}' AND st_status = 'SOLD'`;

    if (branch) { // Checking if branch is provided
      sql_select += ` AND st_branch = '${branch}'`; // Appending branch condition
    }

    sql_select += `
      GROUP BY employee
      ORDER BY total DESC
      LIMIT 5`;

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }
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


//DAITLY
router.post("/daily-sales", (req, res) => {
  try {
    let details = [
      {
        GrossSales: 0,
        Discounts: 0,
        NetSales: 0,
        Refunds: 0,
        GrossProfit: 0,
      },
    ];

    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");
    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);
    console.log("Branch: " + branch);
    let sql_select = `SELECT st_description as description, st_detail_id as detailid, st_total as total
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`;
    // console.log("startDate: ", startDate, "endDate: ", endDate);

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }


    // console.log(sql_select);
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      let NetSales = 0;
      let GrossProfit = 0;
      let GrossSales = 0;
      let Discounts = 0;
      let Refunds = 0;

      if (result.length != 0) {
        const executeQuery = (query) => {
          return new Promise((resolve, reject) => {
            mysql.SelectResult(query, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        };

        const processItems = async () => {
          for (let rowData of result) {
            let detailid = rowData.detailid;
            let total = rowData.total * -1;
            // console.log("Detail ID:", detailid, "Total:", total);
            let descriptionJson = JSON.parse(rowData.description);

            let getRefund = `SELECT * FROM refund WHERE r_detailid = ${detailid}`;
            mysql.SelectResult(getRefund, (err, result) => {
              if (err) {
                console.error("Error: ", err);
                res.json({
                  msg: "error",
                  error: err,
                });
              }

              if (result.length != 0) {
                Refunds += total;
                // console.log("Refund selected:", detailid)
              } else {
                // console.log("No Refund")
              }
            });

            for (let item of descriptionJson) {
              let productname = item.name;
              let totalPrice =
                parseFloat(item.price) * parseFloat(item.quantity);

              let select_product = `SELECT mp_cost as cost FROM master_product WHERE mp_description = '${productname}'`;

              try {
                const queryResult = await executeQuery(select_product);
                if (queryResult.length != 0 && queryResult[0].cost != null) {
                  let cost = parseFloat(queryResult[0].cost).toFixed(2);
                  let totalCost = cost * parseFloat(item.quantity).toFixed(2);
                  let difference =
                    parseFloat(totalPrice).toFixed(2) -
                    parseFloat(totalCost).toFixed(2);
                  // console.log("Name:", item.name, "totalPrice:", totalPrice, "Total Cost:", totalCost, "Difference:", difference)
                  GrossSales += totalPrice;
                  GrossProfit += difference;
                } else {
                  // console.log("Name:", productname, "totalPrice:", totalPrice)
                  Discounts += totalPrice;
                  GrossProfit += totalPrice;
                }
              } catch (err) {
                console.error(err);
              }
            }
          }
        };

        processItems()
          .then(() => {
            NetSales = GrossSales + (Discounts + Refunds);
            details = [
              {
                GrossSales: GrossSales,
                Discounts: Discounts,
                NetSales: NetSales,
                Refunds: Refunds,
                GrossProfit: GrossProfit + Refunds,
              },
            ];
            res.json({
              msg: "success",
              data: details,
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred." });
          });
      } else {
        res.json({
          msg: "success",
          data: details,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/daily-graph", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
    SELECT CONCAT(DATE_FORMAT(st_date, '%h'), ' ', DATE_FORMAT(st_date, '%p')) AS date,
    SUM(st_total) AS total
    FROM sales_detail
    WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59'
    AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    sql_select += " GROUP BY date";

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }
      res.json({
        msg: "success",
        data: result,
      });
      if (result == "") {
        console.log("NO DATA!");
      } else {
        // console.log(sql_select);
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/item", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");
    let activeDiscounts = [];

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `SELECT st_description FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`;

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount);
      });

      // Now that we have fetched the active discounts, proceed with fetching sales data
      mysql.SelectResult(sql_select, (err, result) => {
        if (err) {
          console.error("Error: ", err);
          res.json({
            msg: "error",
            error: err,
          });
          return;
        }

        let sortedProducts = SortProducts(result, activeDiscounts);
        let promises = [];

        sortedProducts.sortedProducts.forEach((row) => {
          const { productName, quantity, price } = row;

          let select_product = `SELECT mp_productid as id, mc_categoryname as category FROM master_product
              INNER JOIN master_category ON mc_categorycode = mp_category WHERE mp_description = '${productName}'`;

          let promise = new Promise((resolve, reject) => {
            mysql.SelectResult(select_product, (err, result) => {
              if (err) {
                console.error("Error: ", err);
                reject(err);
              } else {
                if (result.length != 0) {
                  const { id, category } = result[0];
                  row.productId = id;
                  row.category = category;
                }
                resolve();
              }
            });
          });

          promises.push(promise);
        });

        Promise.all(promises)
          .then(() => {
            // Convert sortedProducts to List<dynamic>
            const data = sortedProducts.sortedProducts.map(product => ({
              productName: product.productName,
              quantity: product.quantity,
              price: product.price,
              productId: product.productId,
              category: product.category
            }));

            res.json({
              msg: "success",
              data: data,
            });
          })
          .catch((err) => {
            console.error("Error: ", err);
            res.json({
              msg: "error",
              error: err,
            });
          });
      });
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});


//WEEKLY
router.post("/weekly-sales", (req, res) => {
  try {
    let details = [
      {
        GrossSales: 0,
        Discounts: 0,
        NetSales: 0,
        Refunds: 0,
        GrossProfit: 0,
      },
    ];

    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");
    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);
    console.log("Branch: " + branch);
    let sql_select = `SELECT st_description as description, st_detail_id as detailid, st_total as total
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`;
    // console.log("startDate: ", startDate, "endDate: ", endDate);

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }


    // console.log(sql_select);
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      let NetSales = 0;
      let GrossProfit = 0;
      let GrossSales = 0;
      let Discounts = 0;
      let Refunds = 0;

      if (result.length != 0) {
        const executeQuery = (query) => {
          return new Promise((resolve, reject) => {
            mysql.SelectResult(query, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        };

        const processItems = async () => {
          for (let rowData of result) {
            let detailid = rowData.detailid;
            let total = rowData.total * -1;
            // console.log("Detail ID:", detailid, "Total:", total);
            let descriptionJson = JSON.parse(rowData.description);

            let getRefund = `SELECT * FROM refund WHERE r_detailid = ${detailid}`;
            mysql.SelectResult(getRefund, (err, result) => {
              if (err) {
                console.error("Error: ", err);
                res.json({
                  msg: "error",
                  error: err,
                });
              }

              if (result.length != 0) {
                Refunds += total;
                // console.log("Refund selected:", detailid)
              } else {
                // console.log("No Refund")
              }
            });

            for (let item of descriptionJson) {
              let productname = item.name;
              let totalPrice =
                parseFloat(item.price) * parseFloat(item.quantity);

              let select_product = `SELECT mp_cost as cost FROM master_product WHERE mp_description = '${productname}'`;

              try {
                const queryResult = await executeQuery(select_product);
                if (queryResult.length != 0 && queryResult[0].cost != null) {
                  let cost = parseFloat(queryResult[0].cost).toFixed(2);
                  let totalCost = cost * parseFloat(item.quantity).toFixed(2);
                  let difference =
                    parseFloat(totalPrice).toFixed(2) -
                    parseFloat(totalCost).toFixed(2);
                  // console.log("Name:", item.name, "totalPrice:", totalPrice, "Total Cost:", totalCost, "Difference:", difference)
                  GrossSales += totalPrice;
                  GrossProfit += difference;
                } else {
                  // console.log("Name:", productname, "totalPrice:", totalPrice)
                  Discounts += totalPrice;
                  GrossProfit += totalPrice;
                }
              } catch (err) {
                console.error(err);
              }
            }
          }
        };

        processItems()
          .then(() => {
            NetSales = GrossSales + (Discounts + Refunds);
            details = [
              {
                GrossSales: GrossSales,
                Discounts: Discounts,
                NetSales: NetSales,
                Refunds: Refunds,
                GrossProfit: GrossProfit + Refunds,
              },
            ];
            res.json({
              msg: "success",
              data: details,
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred." });
          });
      } else {
        res.json({
          msg: "success",
          data: details,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/weekly-graph", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
    SELECT DATE_FORMAT(calendar.date, '%m-%d') AS date, COALESCE(SUM(sales_detail.st_total), 0) AS total
    FROM (
        SELECT DATE('${formattedStartDate}') + INTERVAL (t4 * 1000 + t3 * 100 + t2 * 10 + t1) DAY AS date
        FROM
        (SELECT 0 AS t1 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS t1,
        (SELECT 0 AS t2 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS t2,
        (SELECT 0 AS t3 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS t3,
        (SELECT 0 AS t4 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7) AS t4
        WHERE DATE('${formattedStartDate}') + INTERVAL (t4 * 1000 + t3 * 100 + t2 * 10 + t1) DAY BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'
    ) AS calendar`;

    if (branch) {
      sql_select += ` LEFT JOIN sales_detail ON calendar.date = DATE(sales_detail.st_date) AND sales_detail.st_status = 'SOLD' AND sales_detail.st_branch = '${branch}'`;
    } else {
      sql_select += ` LEFT JOIN sales_detail ON calendar.date = DATE(sales_detail.st_date) AND sales_detail.st_status = 'SOLD'`;
    }

    sql_select += " GROUP BY calendar.date;";

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }
      res.json({
        msg: "success",
        data: result,
      });
      if (result == "") {
        console.log("NO DATA!");
      } else {
        // console.log(sql_select);
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/weekly-topseller", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");
    let activeDiscounts = [];

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
        SELECT st_description
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`;

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount);
      });
    });

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      // const tableData = {
      //   tableDetails: sortedProducts,
      //   totalPrice: overallTotalPrice
      // }

      let data = GraphData(result, activeDiscounts);


      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

//MONTLY
router.post("/monthly-sales", (req, res) => {
  try {
    let details = [
      {
        GrossSales: 0,
        Discounts: 0,
        NetSales: 0,
        Refunds: 0,
        GrossProfit: 0,
      },
    ];

    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split("-");
    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);
    console.log("Branch: " + branch);
    let sql_select = `SELECT st_description as description, st_detail_id as detailid, st_total as total
    FROM sales_detail
    WHERE MONTH(st_date) = MONTH('${formattedStartDate}') AND YEAR(st_date) = YEAR('${formattedEndDate}') AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }


    // console.log(sql_select);
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      let NetSales = 0;
      let GrossProfit = 0;
      let GrossSales = 0;
      let Discounts = 0;
      let Refunds = 0;

      if (result.length != 0) {
        const executeQuery = (query) => {
          return new Promise((resolve, reject) => {
            mysql.SelectResult(query, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        };

        const processItems = async () => {
          for (let rowData of result) {
            let detailid = rowData.detailid;
            let total = rowData.total * -1;
            // console.log("Detail ID:", detailid, "Total:", total);
            let descriptionJson = JSON.parse(rowData.description);

            let getRefund = `SELECT * FROM refund WHERE r_detailid = ${detailid}`;
            mysql.SelectResult(getRefund, (err, result) => {
              if (err) {
                console.error("Error: ", err);
                res.json({
                  msg: "error",
                  error: err,
                });
              }

              if (result.length != 0) {
                Refunds += total;
                // console.log("Refund selected:", detailid)
              } else {
                // console.log("No Refund")
              }
            });

            for (let item of descriptionJson) {
              let productname = item.name;
              let totalPrice =
                parseFloat(item.price) * parseFloat(item.quantity);

              let select_product = `SELECT mp_cost as cost FROM master_product WHERE mp_description = '${productname}'`;

              try {
                const queryResult = await executeQuery(select_product);
                if (queryResult.length != 0 && queryResult[0].cost != null) {
                  let cost = parseFloat(queryResult[0].cost).toFixed(2);
                  let totalCost = cost * parseFloat(item.quantity).toFixed(2);
                  let difference =
                    parseFloat(totalPrice).toFixed(2) -
                    parseFloat(totalCost).toFixed(2);
                  // console.log("Name:", item.name, "totalPrice:", totalPrice, "Total Cost:", totalCost, "Difference:", difference)
                  GrossSales += totalPrice;
                  GrossProfit += difference;
                } else {
                  // console.log("Name:", productname, "totalPrice:", totalPrice)
                  Discounts += totalPrice;
                  GrossProfit += totalPrice;
                }
              } catch (err) {
                console.error(err);
              }
            }
          }
        };

        processItems()
          .then(() => {
            NetSales = GrossSales + (Discounts + Refunds);
            details = [
              {
                GrossSales: GrossSales,
                Discounts: Discounts,
                NetSales: NetSales,
                Refunds: Refunds,
                GrossProfit: GrossProfit + Refunds,
              },
            ];
            res.json({
              msg: "success",
              data: details,
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred." });
          });
      } else {
        res.json({
          msg: "success",
          data: details,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/monthly-graph", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split("-");

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
    SELECT DATE_FORMAT(st_date, '%m-%d') AS date, SUM(st_total) AS total
    FROM sales_detail
    WHERE MONTH(st_date) = MONTH('${formattedStartDate}') 
        AND YEAR(st_date) = YEAR('${formattedEndDate}') 
        AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    sql_select += ` GROUP BY DATE_FORMAT(st_date, '%m-%d');`;
    
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }
      res.json({
        msg: "success",
        data: result,
      });
      if (result == "") {
        console.log("NO DATA!");
      } else {
        // console.log(sql_select);
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/monthly-topseller", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split("-");
    let activeDiscounts = [];

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
        SELECT st_description
        FROM sales_detail
        WHERE MONTH(st_date) = MONTH('${formattedStartDate}') AND YEAR(st_date) = YEAR('${formattedEndDate}') AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`;

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount);
      });
    });

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      // const tableData = {
      //   tableDetails: sortedProducts,
      //   totalPrice: overallTotalPrice
      // }

      let data = GraphData(result, activeDiscounts);


      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.post("/monthlyitem", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split("-");
    let activeDiscounts = [];

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `SELECT st_description FROM sales_detail
        WHERE MONTH(st_date) = MONTH('${formattedStartDate}') AND YEAR(st_date) = YEAR('${formattedEndDate}') AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`;
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`;

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error("Error: ", err);
        res.json({
          msg: "error",
          error: err,
        });
        return;
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount);
      });

      // Now that we have fetched the active discounts, proceed with fetching sales data
      mysql.SelectResult(sql_select, (err, result) => {
        if (err) {
          console.error("Error: ", err);
          res.json({
            msg: "error",
            error: err,
          });
          return;
        }

        let sortedProducts = SortProducts(result, activeDiscounts);
        let promises = [];

        sortedProducts.sortedProducts.forEach((row) => {
          const { productName, quantity, price } = row;

          let select_product = `SELECT mp_productid as id, mc_categoryname as category FROM master_product
              INNER JOIN master_category ON mc_categorycode = mp_category WHERE mp_description = '${productName}'`;

          let promise = new Promise((resolve, reject) => {
            mysql.SelectResult(select_product, (err, result) => {
              if (err) {
                console.error("Error: ", err);
                reject(err);
              } else {
                if (result.length != 0) {
                  const { id, category } = result[0];
                  row.productId = id;
                  row.category = category;
                }
                resolve();
              }
            });
          });

          promises.push(promise);
        });

        Promise.all(promises)
          .then(() => {
            // Convert sortedProducts to List<dynamic>
            const data = sortedProducts.sortedProducts.map(product => ({
              productName: product.productName,
              quantity: product.quantity,
              price: product.price,
              productId: product.productId,
              category: product.category
            }));

            res.json({
              msg: "success",
              data: data,
            });
          })
          .catch((err) => {
            console.error("Error: ", err);
            res.json({
              msg: "error",
              error: err,
            });
          });
      });
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

//PRODUCT LIST
router.post("/loadproduct", (req, res) => {
  try {
    let { category } = req.body;
    let sql = `SELECT 
    mp_productid as productid, mp_description as description, mp_price as price, mc_categoryname as category, 
    mp_barcode as barcode, mp_status as status, mp_cost as cost
FROM master_product
INNER JOIN master_category on mp_category = mc_categorycode`;

    if (category) {
      sql += ` WHERE mc_categoryname = '${category}'`;
    }

    sql += ` ORDER BY mp_productid DESC;`;
    
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
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.post("/allimage", (req, res) => {
  try {
    let { productid } = req.body;

    let sql = `SELECT mp_productid as productid, mp_productimage as image from master_product`;

    if (productid) {
      sql += ` WHERE mp_productid = '${productid}'`;
    }

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


//INVENTORY
router.post("/inventoryload", (req, res) => {
  try {
    let { branch, category, productname } = req.body;
    let sql = `SELECT
    MAX(pi_inventoryid) AS inventoryid,
    MAX(mp_description) AS productname,
    MAX(pi_branchid) AS branchid,
    SUM(pi_quantity) AS quantity,
    MAX(mc_categoryname) AS category,
    mp_productid AS productid
FROM 
    product_inventory
INNER JOIN 
    master_product ON mp_productid = pi_productid
INNER JOIN 
    master_branch ON mb_branchid = pi_branchid
INNER JOIN 
    master_category ON mc_categorycode = pi_category
WHERE mp_productid IN (SELECT DISTINCT mp_productid FROM master_product)`;

    if (branch) {
      sql += ` AND pi_branchid = '${branch}'`;
    }

    if (productname) {
      sql += ` AND mp_description = '${productname}'`;
    }

    if (category) {
      sql += ` AND mc_categoryname = '${category}'`;
    }

    sql += ` GROUP BY mp_productid ORDER BY productid DESC;`;

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

router.post("/getinventorybranch", (req, res) => {
  try {
    let {productid } = req.body;

    let sql = `SELECT
    pi_inventoryid AS inventoryid,
    mp_description AS productname,
    pi_branchid AS branchid,
    mb.mb_branchname AS branchname,
    pi_quantity AS quantity,
    mc_categoryname AS category,
    mp_productid AS productid
FROM 
    product_inventory
INNER JOIN 
    master_product ON mp_productid = pi_productid
INNER JOIN 
    master_branch ON mb_branchid = pi_branchid
INNER JOIN 
    master_category ON mc_categorycode = pi_category
INNER JOIN 
    master_branch AS mb ON mb.mb_branchid = pi_branchid
WHERE 
    pi_productid = '${productid}';`;

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







function ProcessedStaffSales(data) {
  const mergedData = {};

  data.forEach((item) => {
    const { cashier, total, branch, description, employeeid } = item;
    const key = `${cashier}-${branch}`;

    const totalPrice = parseFloat(total);

    if (!mergedData[key]) {
      mergedData[key] = {
        cashier,
        totalSales: totalPrice,
        branch,
        employeeid,
        soldItems: JSON.parse(description).reduce((acc, curr) => {
          const existingItem = acc.find((i) => i.name === curr.name);
          if (existingItem) {
            existingItem.quantity += curr.quantity;
            existingItem.totalPrice += curr.price * curr.quantity;
          } else {
            acc.push({
              name: curr.name,
              quantity: curr.quantity,
              totalPrice: curr.price * curr.quantity,
            });
          }
          return acc;
        }, []),
        commission: totalPrice * 0.04,
      };
    } else {
      mergedData[key].totalSales += totalPrice;
      JSON.parse(description).forEach((product) => {
        const existingItem = mergedData[key].soldItems.find(
          (i) => i.name === product.name
        );
        if (existingItem) {
          existingItem.quantity += product.quantity;
          existingItem.totalPrice += product.price * product.quantity; // Calculate total price for existing item
        } else {
          mergedData[key].soldItems.push({
            name: product.name,
            quantity: product.quantity,
            totalPrice: product.price * product.quantity, // Include total price for new item
          });
        }
      });
      mergedData[key].commission += totalPrice * 0.04;
    }
  });

  const mergedRows = Object.values(mergedData);
  return mergedRows;
}

function ProcessDailyPurchasedProduct(data) {
  const overallQuantityMap = new Map();
  const overallPriceMap = new Map();

  data.forEach((row) => {
    const soldItems = JSON.parse(row.description);

    soldItems.forEach((item) => {
      const { name, quantity, price } = item;

      if (overallQuantityMap.has(name)) {
        overallQuantityMap.set(name, overallQuantityMap.get(name) + quantity);
        overallPriceMap.set(name, overallPriceMap.get(name) + quantity * price);
      } else {
        overallQuantityMap.set(name, quantity);
        overallPriceMap.set(name, quantity * price);
      }
    });
  });

  // Create arrays from maps
  const overallQuantityArray = Array.from(
    overallQuantityMap,
    ([productName, quantity]) => ({ productName, quantity })
  );
  const overallPriceArray = Array.from(
    overallPriceMap,
    ([productName, totalPrice]) => ({ productName, totalPrice })
  );

  // Combine arrays and sort by quantity in descending order
  const combinedArray = overallQuantityArray.map((item) => ({
    ...item,
    totalPrice:
      overallPriceArray.find(({ productName }) => productName === item.productName)
        ?.totalPrice || 0,
  })).sort((a, b) => b.quantity - a.quantity);

  return combinedArray;
}


function GraphData(data, activeDiscounts) {
  const items = {};

  data.forEach((entry) => {
    const itemsArray = JSON.parse(entry.st_description);
    itemsArray.forEach((item) => {
      let shouldIncludeItem = true;
      activeDiscounts.forEach((discount) => {
        if (item.name.toLowerCase().includes(discount.toLowerCase())) {
          shouldIncludeItem = false;
        }
      });

      if (shouldIncludeItem) {
        if (!items[item.name]) {
          items[item.name] = {
            name: item.name,
            totalQuantity: item.quantity,
          };
        } else {
          items[item.name].totalQuantity += item.quantity;
        }
      }
    });
  });

  const aggregatedItems = Object.values(items);
  aggregatedItems.sort((a, b) => b.totalQuantity - a.totalQuantity);
  const topItems = aggregatedItems.slice(0, 5);

  return topItems;
}

function SortProducts(data, activeDiscounts) {
  const mergedData = {};
  let overallTotalPrice = 0;

  data.forEach((item) => {
    const parsedItem = JSON.parse(item.st_description);

    parsedItem.forEach((product) => {
      const { name, price, quantity } = product;

      let shouldIncludeProduct = true;
      activeDiscounts.forEach((discount) => {
        if (name.toLowerCase().includes(discount.toLowerCase())) {
          shouldIncludeProduct = false;
        }
      });

      if (shouldIncludeProduct) {
        if (mergedData[name]) {
          mergedData[name].quantity += quantity;
          mergedData[name].price += price * quantity;
        } else {
          mergedData[name] = { quantity, price: price * quantity };
        }
        overallTotalPrice += price * quantity;
      }
    });
  });

  const sortedProducts = Object.entries(mergedData)
    .map(([productName, productDetails]) => ({
      productName,
      ...productDetails,
    }))
    .sort((a, b) => b.quantity - a.quantity);

  const productDetails = {
     sortedProducts,
  };

  return productDetails;
}
