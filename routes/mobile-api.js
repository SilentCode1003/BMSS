var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");
const crypto = require('./repository/cryptography');
const { Logger } = require("./repository/logger");

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

// router.post("/yearly-graph", (req, res) => {
//   try {
//     let { daterange, branch } = req.body;

//     let sql_select = `
//     SELECT DATE_FORMAT(st_date, '%m-%Y') AS date, SUM(st_total) AS total
//     FROM sales_detail
//     WHERE YEAR(st_date) = '${daterange}'
//         AND st_status = 'SOLD'`;

//     if (branch) {
//       sql_select += ` AND st_branch = '${branch}'`;
//     }

//      sql_select += ` GROUP BY DATE_FORMAT(st_date, '%m-%Y');`;
    
//     mysql.SelectResult(sql_select, (err, result) => {
//       if (err) {
//         console.error("Error: ", err);
//         res.json({
//           msg: "error",
//           error: err,
//         });
//         return;
//       }
//       res.json({
//         msg: "success",
//         data: result,
//       });
//       if (result == "") {
//         console.log("NO DATA!");
//       } else {
//         // console.log(sql_select);
//       }
//     });
//   } catch (error) {
//     res.json({
//       msg: "error",
//       error: error,
//     });
//   }
// });

router.post("/yearly-graph", (req, res) => {
  try {
    let { daterange, branch } = req.body;

    let sql_select = `
    SELECT DATE_FORMAT(STR_TO_DATE(CONCAT('01-', months.month_year), '%d-%m-%Y'), '%b') AS date, 
           IFNULL(SUM(sales_detail.st_total), 0) AS total
    FROM
    (SELECT '01-${daterange}' AS month_year UNION ALL
     SELECT '02-${daterange}' UNION ALL
     SELECT '03-${daterange}' UNION ALL
     SELECT '04-${daterange}' UNION ALL
     SELECT '05-${daterange}' UNION ALL
     SELECT '06-${daterange}' UNION ALL
     SELECT '07-${daterange}' UNION ALL
     SELECT '08-${daterange}' UNION ALL
     SELECT '09-${daterange}' UNION ALL
     SELECT '10-${daterange}' UNION ALL
     SELECT '11-${daterange}' UNION ALL
     SELECT '12-${daterange}') AS months
    LEFT JOIN sales_detail ON DATE_FORMAT(sales_detail.st_date, '%m-%Y') = months.month_year
    AND sales_detail.st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND sales_detail.st_branch = '${branch}'`;
    }

    sql_select += ` GROUP BY months.month_year;`;

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
      if (result.length === 0) {
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

router.post("/employee-sales", (req, res) => {
  try {
    let { date, branch } = req.body;

    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      WHERE st_date BETWEEN '${date} 00:00:00' AND '${date} 23:59:59' AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND mb_branchid = '${branch}'`;
    }

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }

      let data = [];

      if (result.length != 0) {
        data = ProcessedStaffSales(result);
      }

      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({ msg: error });
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

router.post("/weekly-employee-sales", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      WHERE st_date BETWEEN '${formattedStartDate} 00:00:00' AND '${formattedEndDate} 23:59:59' AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND mb_branchid = '${branch}'`;
    }

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }

      let data = [];

      if (result.length != 0) {
        data = ProcessedStaffSales(result);
      }

      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({ msg: error });
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

router.post("/month-employee-sales", (req, res) => {
  try {
    let { daterange, branch } = req.body;
    let [startDate, endDate] = daterange.split(" - ");

    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      WHERE MONTH(st_date) = MONTH('${formattedStartDate}') AND YEAR(st_date) = YEAR('${formattedEndDate}') AND st_status = 'SOLD'`;

    if (branch) {
      sql_select += ` AND mb_branchid = '${branch}'`;
    }

    
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }

      let data = [];

      if (result.length != 0) {
        data = ProcessedStaffSales(result);
      }

      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

//PRODUCT LIST
router.post("/loadproduct", (req, res) => {
  try {
    let { category, productid  } = req.body;
    let sql = `SELECT 
    mp_productid as productid, mp_description as description, mp_price as price, mc_categoryname as category, 
    mc_categorycode as categorycode, mp_barcode as barcode, mp_status as status, mp_cost as cost
    FROM master_product
   INNER JOIN master_category on mp_category = mc_categorycode`;

    if (category) {
      sql += ` WHERE mc_categoryname = '${category}'`;
    }

    if (productid) {
      sql += ` AND mp_productid = '${productid}'`;
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

router.post("/addproduct", (req, res) => {
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
    let employeeid = req.body.employeeid;

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
                        let user = employeeid;

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
                  let user = employeeid;

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
          let user = employeeid;

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

router.patch("/editproduct", (req, res) => {
  try {
    const { productid, description, productimage, barcode, category, cost, employeeid } =
      req.body;

      console.log('productid:', productid);
      console.log('description:', description);
      console.log('barcode:', barcode);
      console.log('category:', category);
      console.log('cost:', cost);
      console.log('employeeid:', employeeid);
      console.log('productimage:', productimage);

    let data = [];
    let priceData = [];
    let sql_Update = `UPDATE master_product SET`;

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

    if (cost) {
      sql_Update += ` mp_cost = ?,`;
      data.push(cost);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE mp_productid = ?;`;
    data.push(productid);

    let sql_check = `SELECT * FROM master_product WHERE mp_description='${description}'`;

    if (description || productimage || barcode || category) {
      let sql_Update_product_price = `UPDATE product_price SET`;

      if (description) {
        sql_Update_product_price += ` pp_description = ?,`;
        priceData.push(description);
      }

      if (productimage) {
        sql_Update_product_price += ` pp_product_image = ?,`;
        priceData.push(productimage);
      }

      if (barcode) {
        sql_Update_product_price += ` pp_barcode = ?,`;
        priceData.push(barcode);
      }

      if (category) {
        sql_Update_product_price += ` pp_category = ?,`;
        priceData.push(category);
      }

      sql_Update_product_price = sql_Update_product_price.slice(0, -1);
      sql_Update_product_price += ` WHERE pp_product_id = ?;`;
      priceData.push(productid);

      mysql.UpdateMultiple(
        sql_Update_product_price,
        priceData,
        (err, result) => {
          if (err) console.error("Error: ", err);
          console.log(result);
          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.UPDT()
          )} -  [${sql_Update_product_price}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);
        }
      );
    }

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
          let user = employeeid;

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

router.post("/getinventoryitem", (req, res) => {
  try {
    let {productid, branch } = req.body;

    let sql = `SELECT
    pi_inventoryid AS inventoryid,
    mp_description AS productname,
    mp_productid AS productid,
    pi_branchid AS branchid,
    mb_branchname AS branchname, -- Add this line to select branch name
    pi_quantity AS quantity,
    mc_categoryname AS category
FROM 
    product_inventory
INNER JOIN 
    master_product ON mp_productid = pi_productid
INNER JOIN 
    master_branch ON mb_branchid = pi_branchid
INNER JOIN 
    master_category ON mc_categorycode = pi_category
WHERE 
    pi_productid = '${productid}' AND pi_branchid = '${branch}';
`;

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

router.post("/addinventory", (req, res) => {
  try {
    let productdata = JSON.parse(req.body.productdata);
    console.log("to be processed:", productdata);
    let completedIterations = 0;
    let totalIterations = productdata.length;
    console.log("total loop: " + totalIterations);

    productdata.forEach((item, index) => {
      let productid = item.productid;
      let quantity = item.quantity;
      let branchid = item.branchid;

      let sql = `select pi_quantity from product_inventory where pi_productid = '${productid}' and pi_branchid = '${branchid}'`;
      let sql_notification = `select * from notification where n_inventoryid = '${productid}${branchid}' and n_branchid = '${branchid}'`;
      console.log(sql_notification);

      mysql.Select(sql_notification, "Notification", (err, result) => {
        if (err) {
          console.log("Error: ", err);
        }
        console.log("Data notif:", result);
        if (result.length != 0) {
          let sql_updateChecker = `UPDATE notification SET n_checker = ? WHERE n_inventoryid = ? and n_branchid = ?`;
          let inventoryid = productid + branchid;
          let sql_updateData = [0, inventoryid, branchid];

          mysql.UpdateMultiple(
            sql_updateChecker,
            sql_updateData,
            (err, result) => {
              if (err) {
                console.error("Error: ", err);
              }

              completedIterations++;
              if (completedIterations === totalIterations) {
                res.json({
                  msg: "success",
                });
              }
            }
          );
        }
      });

      mysql.Select(sql, "ProductInventory", (err, result) => {
        if (err) {
          return res.json({
            msg: err,
          });
        }
        // console.log("current quantity: "+result[0].quantity)
        let initialquantity = result[0].quantity;
        let finalquantity = parseFloat(initialquantity) + parseFloat(quantity);
        let data = [finalquantity, productid, branchid];
        // console.log(data)
        let sql_Update = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_productid = ? AND pi_branchid = ?`;

        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) {
            console.error("Error: ", err);
          }

          completedIterations++;
          if (completedIterations === totalIterations) {
            res.json({
              msg: "success",
            });
          }
        });

        console.log(helper.GetCurrentDatetime());
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

//EMPLOYEE

router.post("/employeelist", (req, res) => {
  try {
    let { employeeid } = req.body;

    let sql = `SELECT 
    me_employeeid AS employeeid,
    me_fullname AS fullname,
    me_position AS position,
    mpt_positionname AS positionname,
    me_contactinfo AS contact,
    me_datehired AS datehired,
    me_createddate AS createddate,
    me_status as status
    FROM master_employees
    INNER JOIN 
    master_position_type ON master_employees.me_position = mpt_positioncode
    WHERE me_status = 'ACTIVE'`;

    if (employeeid) {
      sql += ` AND me_employeeid = '${employeeid}'`;
    }

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

router.post("/addemployee", (req, res) => {
  try {
    let fullname = req.body.fullname;
    let positionname = req.body.positionname;
    let contactinfo = req.body.contactinfo;
    let datehired = req.body.datehired;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.body.createdby;
    let createdate = helper.GetCurrentDatetime();
    let employeeid = req.body.employeeid;
    let data = [];

    console.log(employeeid);

    let sql_check = `select * from master_employees where me_fullname='${fullname}'`;

    mysql.Select(sql_check, "MasterEmployees", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          fullname,
          positionname,
          contactinfo,
          datehired,
          status,
          createdby,
          createdate,
        ]);

        mysql.InsertTable("master_employees", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.INSD()
          )} -  [${data}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);

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

router.post("/editemployee", (req, res) => {
  try {
    let employeeid = req.body.employeeid;
    let positionname = req.body.positionname;
    let contactinfo = req.body.contactinfo;
    let fullname = req.body.fullname;

    let data = [];
    let sql_Update = `UPDATE master_employees SET`;

    if (positionname) {
      sql_Update += ` me_position = ?,`;
      data.push(positionname);
    }

    if (contactinfo) {
      sql_Update += ` me_contactinfo = ?,`;
      data.push(contactinfo);
    }

    if (fullname) {
      sql_Update += ` me_fullname = ?,`;
      data.push(fullname);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE me_employeeid = ?;`;
    data.push(employeeid);

    let sql_check = `SELECT * FROM master_employees WHERE me_employeeid='${employeeid}'`;

    mysql.Select(sql_check, "MasterEmployees", (err, result) => {
      if (err) {
        console.error("Error: ", err);
        return res.json({
          msg: "error",
        });
      }

      if (result.length !== 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
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
      msg: "error",
    });
  }
});

router.get('/loadposition', (req, res) => {
  try {
      let sql = `select * from master_position_type`;

      mysql.Select(sql, 'MasterPositionType', (err, result) => {
          if (err) {
              return res.json({
                  msg: err
              })
          }

          console.log(helper.GetCurrentDatetime());

          res.json({
              msg: 'success',
              data: result
          })
      });
  } catch (error) {
      res.json({
          msg: error
      })
  }
})


//PAYMENT
router.get("/payment", (req, res) => {
  try {
    let sql = `select * from master_payment`;

    mysql.Select(sql, "MasterPayment", (err, result) => {
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

router.post("/addpayment", (req, res) => {
  try {
    let paymentname = req.body.paymentname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.body.fullname;
    let createdate = helper.GetCurrentDatetime();
    let employeeid = req.body.employeeid
    let data = [];

    let sql_check = `select * from master_payment where mp_paymentname='${paymentname}'`;

    mysql.Select(sql_check, "MasterPayment", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([paymentname, status, createdby, createdate]);

        mysql.InsertTable("master_payment", data, (err, result) => {
          if (err) console.error("Error: ", err);

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.INSD()
          )} -  [${data}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);


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

router.post("/editpayment", (req, res) => {
  try {
    let paymentname = req.body.paymentname;
    let paymentcode = req.body.paymentcode;
    let employeeid = req.body.employeeid;

    let data = [paymentname, paymentcode];

    let sql_Update = `UPDATE master_payment 
                      SET mp_paymentname = ?
                      WHERE mp_paymentid = ?`;

    let sql_check = `SELECT * FROM master_payment WHERE mp_paymentname='${paymentname}'`;

    mysql.Select(sql_check, "MasterPayment", (err, result) => {
      if (err) {
        console.error("Error: ", err);
        return res.json({ msg: err.message });
      }

      if (result.length == 1) {
        return res.json({
          msg: "duplicate",
          data: [],
          description: "Duplicate entry found"
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) {
            console.error("Error: ", err);
            return res.json({ msg: err.message, data: [], description: "" });
          }

          console.log(result);

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);

          res.json({
            msg: "success",
            data: [], // Ensure 'data' is a list
            description: "Payment updated successfully"
          });
          console.log("Success message sent");
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error.message,
      data: [], // Ensure 'data' is a list
      description: ""
    });
  }
});



//CATEGORY

router.post("/getcategory", (req, res) => {
  try {
    let { categorycode } = req.body;
    
    let sql = `select * from master_category`;

    if (categorycode) {
      sql += ` WHERE mc_categorycode = '${categorycode}'`;
    }

    mysql.Select(sql, "MasterCategory", (err, result) => {
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


router.post("/addcategory", (req, res) => {
  try {
    let categoryname = req.body.categoryname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.body.fullname;
    let createddate = helper.GetCurrentDatetime();
    let employeeid = req.body.employeeid;
    let data = [];

    let sql_check = `select * from master_category where mc_categoryname='${categoryname}'`;

    mysql.Select(sql_check, "MasterCategory", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([categoryname, status, createdby, createddate]);

        mysql.InsertTable("master_category", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result[0]["id"]);

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.INSD()
          )} -  [${data}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);

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

router.post("/editcategory", (req, res) => {
  try {
    let categoryname = req.body.categoryname;
    let categorycode = req.body.categorycode;
    let employeeid = req.body.employeeid;

    let data = [categoryname, categorycode];
    // console.log(data);
    let sql_Update = `UPDATE master_category 
                       SET mc_categoryname = ?
                       WHERE mc_categorycode = ?`;

    let sql_check = `SELECT * FROM master_category WHERE mc_categoryname='${categoryname}'`;

    mysql.Select(sql_check, "MasterCategory", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length == 1) {
        return res.json({
          msg: "duplicate",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);

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

router.post("/staff-sales", (req, res) => {
  try {
    let { daterange, cashier } = req.body;
    let [startDate, endDate] = daterange.split(" - ");
    let formattedStartDate = helper.ConvertDate(startDate);
    let formattedEndDate = helper.ConvertDate(endDate);

    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch, me_employeeid as employeeid
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      INNER JOIN master_employees ON me_fullname = st_cashier
      WHERE st_date BETWEEN '${formattedStartDate} 00:00:00' AND '${formattedEndDate} 23:59:59' AND st_status = 'SOLD'`;

    // console.log(sql_select)
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }

      let data = [];

      if (result.length != 0) {
        data = ProcessedStaffSales(result);
        data = MergeObjects(data);

        let promises = [];

        data.soldItems.forEach((row) => {
          const { name, quantity, totalPrice } = row;
          // console.log(name, quantity, totalPrice)
          let select_product = `SELECT mp_productid as id, mc_categoryname as category FROM master_product
              INNER JOIN master_category ON mc_categorycode = mp_category WHERE mp_description = '${name}'`;

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
            // console.log(data);
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
      } else {
        res.json({
          msg: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    res.json({ msg: error });
  }
});

//CHANGE PASS
router.post('/changepass', (req, res) => {
  try {
    let { currentpassword, newpassword, usercode, employeeid } = req.body;

    // Check for null or undefined values
    if (!currentpassword || !newpassword || !usercode || !employeeid) {
      return res.status(400).json({ msg: 'Invalid input' });
    }

    console.log(`currentpassword: ${currentpassword}, newpassword: ${newpassword}, usercode: ${usercode}, employeeid: ${employeeid}`);

    crypto.Encrypter(currentpassword, (err, encryptedpass) => {
      if (err) {
        console.error('Encryption Error: ', err);
        return res.json({ msg: 'Encryption Error' });
      }
      crypto.Encrypter(newpassword, (err, newencryptedpass) => {
        if (err) {
          console.error('Encryption Error: ', err);
          return res.json({ msg: 'Encryption Error' });
        }

        let data = [newencryptedpass, usercode];

        let sql_Update = `UPDATE master_user SET mu_password = ? WHERE mu_usercode = ?`;

        let sql_check = `SELECT * FROM master_user WHERE mu_password='${encryptedpass}' AND mu_usercode='${usercode}'`;

        mysql.Select(sql_check, 'MasterUser', (err, result) => {
          if (err) {
            console.error('Database Error: ', err);
            return res.json({ msg: 'Database Error' });
          }

          if (result.length !== 1) {
            return res.json({ msg: 'notmatch' });
          } else {
            mysql.UpdateMultiple(sql_Update, data, (err, result) => {
              if (err) {
                console.error('Database Error: ', err);
                return res.json({ msg: 'Database Error' });
              }

              console.log(result);

              let loglevel = dictionary.INF();
              let source = dictionary.MSTR();
              let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
              let user = employeeid;

              Logger(loglevel, source, message, user);

              res.status(200).json({ msg: 'success' });
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Catch Error: ', error);
    res.json({ msg: error.toString() });
  }
});

//BRANCH
router.post("/addbranch", (req, res) => {
  try {
    let branchid = req.body.branchid;
    let branchname = req.body.branchname;
    let tin = req.body.tin;
    let address = req.body.address;
    let logo = req.body.logo;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = req.body.createdby;
    let createdate = helper.GetCurrentDatetime();
    let employeeid = req.body.employeeid;
    let data = [];

    let sql_check = `select * from master_branch where mb_branchid='${branchid}'`;
    mysql.Select(sql_check, "MasterBranch", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          branchid,
          branchname,
          tin,
          address,
          logo,
          status,
          createdby,
          createdate,
        ]);
        mysql.InsertTable("master_branch", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(
            dictionary.INSD()
          )} -  [Branch: ${branchid}]`;
          let user = employeeid;

          Logger(loglevel, source, message, user);

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

router.post("/editbranch", (req, res) => {
  try {
    let branchid = req.body.branchid;
    let branchname = req.body.branchname;
    let tin = req.body.tin;
    let address = req.body.address;
    let logo = req.body.logo;
    let employeeid = req.body.employeeid; // Corrected typo here

    let data = [];
    let sql_Update = `UPDATE master_branch SET`;

    if (branchname) {
      sql_Update += ` mb_branchname = ?,`;
      data.push(branchname);
    }

    if (tin) {
      sql_Update += ` mb_tin = ?,`;
      data.push(tin);
    }
    if (address) {
      sql_Update += ` mb_address = ?,`;
      data.push(address);
    }

    if (logo) {
      sql_Update += ` mb_logo = ?,`;
      data.push(logo);
    }

    sql_Update = sql_Update.slice(0, -1);
    sql_Update += ` WHERE mb_branchid = ?;`;
    data.push(branchid);

    let sql_check = `SELECT * FROM master_branch WHERE mb_branchid='${branchid}'`;

    mysql.Select(sql_check, "MasterBranch", (err, result) => {
      if (err) {
        console.error("Error selecting from database: ", err); // Log error here
        return res.json({
          msg: "error",
        });
      }
      console.log("Result from SELECT query: ", result); // Log result here
      if (result.length !== 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error updating database: ", err); // Log error here
          console.log("Result from UPDATE query: ", result); // Log result here

          let loglevel = dictionary.INF();
          let source = dictionary.MSTR();
          let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${sql_Update}]`;
          let user = employeeid;
    
          Logger(loglevel, source, message, user);

          res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    console.error("Caught exception: ", error); // Log caught exception here
    res.json({
      msg: "error",
    });
  }
});

//NOTIFICATION

router.post("/getnotification", (req, res) => {
  try {
    let { usercode } = req.body;

    let sql = `SELECT n_id as notificationid,
    n_userid as userid,
    n_inventoryid as inventoryid,
    n_branchid as branchid,
    n_quantity as quantity,
    n_message as message,
    n_status as status,
    n_checker as checker, 
    n_date as date,
    mp_description as productname,
    mb_branchname as branch
     FROM notification 
     inner join product_inventory on notification.n_inventoryid = pi_inventoryid
     inner join master_product on product_inventory.pi_productid = mp_productid
     inner join master_branch on notification.n_branchid = mb_branchid
    WHERE n_userid = '${usercode}'
      AND (n_status = 'READ' OR n_status = 'UNREAD')
    ORDER BY n_date DESC;`;


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

router.post("/readnotification", (req, res) => {
  try {
    let notificationid = req.body.notificationid;
    let status = "READ";

    let data = [status, notificationid];

    let sql_Update = `UPDATE notification 
                       SET n_status = ?
                       WHERE n_id = ?`;

    let sql_check = `SELECT * FROM notification WHERE n_id='${notificationid}'`;

    mysql.Select(sql_check, "Notification", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          // console.log(result);

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

router.post("/deletenotification", (req, res) => {
  try {
    let notificationid = req.body.notificationid;
    let status = "CLOSED";

    let data = [status, notificationid];

    let sql_Update = `UPDATE notification 
                       SET n_status = ?
                       WHERE n_id = ?`;

    let sql_check = `SELECT * FROM notification WHERE n_id='${notificationid}'`;

    mysql.Select(sql_check, "Notification", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          // console.log(result);

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

router.post("/recievednotification", (req, res) => {
  try {
    let notificationid = req.body.notificationid;
    let checker = "1";

    let data = [checker, notificationid];

    let sql_Update = `UPDATE notification 
                       SET n_checker = ?
                       WHERE n_id = ?`;

    let sql_check = `SELECT * FROM notification WHERE n_id='${notificationid}'`;

    mysql.Select(sql_check, "Notification", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
        return res.json({
          msg: "notexist",
        });
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          // console.log(result);

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









function ProcessedStaffSales(data) {
  const mergedData = {};

  data.forEach((item) => {
    const { date, cashier, total, branch, description, employeeid } = item;
    const key = `${cashier}-${branch}`;

    const totalPrice = parseFloat(total);

    if (!mergedData[key]) {
      mergedData[key] = {
        date,
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
          existingItem.totalPrice += product.price * product.quantity;
        } else {
          mergedData[key].soldItems.push({
            name: product.name,
            quantity: product.quantity,
            totalPrice: product.price * product.quantity,
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

function MergeObjects(data) {
  const mergedData = {
    branch: [],
    totalSales: 0,
    soldItems: [],
    commission: 0,
    totalQuantity: 0,
    employeeid: null,
  };

  data.forEach((entry) => {
    mergedData.branch.push(entry.branch);
    mergedData.totalSales += entry.totalSales;

    // Add employeeid if it's not already set
    if (!mergedData.employeeid) {
      mergedData.employeeid = entry.employeeid;
    }

    entry.soldItems.forEach((item) => {
      const existingItem = mergedData.soldItems.find(
        (i) => i.name === item.name
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.totalPrice += item.totalPrice;
      } else {
        mergedData.soldItems.push({ ...item });
      }
      mergedData.totalQuantity += item.quantity;
    });

    mergedData.commission += entry.commission;
  });

  return mergedData;
}

