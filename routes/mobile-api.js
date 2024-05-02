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

router.post("/all-branch/daily-sales", (req, res) => {
  try {
    let { date } = req.body;
    let total = 0;
    let totalSold = 0;
    let sql = `SELECT 
                mb_branchname as branch,
                SUM(CAST(st_total AS DECIMAL(10, 2))) AS totalSales
              FROM sales_detail
              INNER JOIN master_branch ON mb_branchid = st_branch
              WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_status = 'SOLD'
              GROUP BY mb_branchname;`;

    let sql_description = `SELECT st_description as description FROM sales_detail WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_status = 'SOLD'`;

    mysql.SelectResult(sql_description, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      result.forEach((row) => {
        const description = JSON.parse(row.description);
        description.forEach((item) => {
          const { name, price, quantity } = item;
          // console.log(`Name: ${name} Quantity: ${quantity} Price: ${price}`)

          total += price * quantity;
          totalSold += quantity;
        });
      });

      mysql.SelectResult(sql, (err, result) => {
        if (err) {
          console.log(err);
          return res.json({
            msg: err,
          });
        }
        let data = [];
        if (result.length != 0) {
          const totalSales = result[0].totalSales;

          data = [
            {
              totalSales: totalSales,
              totalSold: totalSold,
            },
          ];
        } else {
          data = [
            {
              totalSales: 0,
              totalSold: totalSold,
            },
          ];
        }

        res.json({
          msg: "success",
          data: data,
        });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/by-branch/daily-sales", (req, res) => {
  try {
    let { date, branch } = req.body;
    let total = 0;
    let totalSold = 0;
    let sql = `SELECT 
                mb_branchname as branch,
                SUM(CAST(st_total AS DECIMAL(10, 2))) AS totalSales
              FROM sales_detail
              INNER JOIN master_branch ON mb_branchid = st_branch
              WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_branch = '${branch}' AND st_status = 'SOLD'
              GROUP BY mb_branchname;`;

    let sql_description = `SELECT st_description as description FROM sales_detail WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_branch = '${branch}' AND st_status = 'SOLD'`;

    mysql.SelectResult(sql_description, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }
      // console.log("1st query result:", result);

      result.forEach((row) => {
        const description = JSON.parse(row.description);
        description.forEach((item) => {
          const { name, price, quantity } = item;

          total += price * quantity;
          totalSold += quantity;
        });
      });

      if (result.length != 0) {
        mysql.SelectResult(sql, (err, result) => {
          if (err) {
            console.log(err);
            return res.json({
              msg: err,
            });
          }
          // console.log("2nd query result:", result);

          const branch = result[0].branch;
          const totalSales = result[0].totalSales;

          const data = [
            {
              totalSales: totalSales,
              totalSold: totalSold,
            },
          ];

          res.json({
            msg: "success",
            data: data,
          });
        });
      } else {
        const data = [
          {
            totalSales: 0,
            totalSold: 0,
          },
        ];

        res.json({
          msg: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/all-branch/daily-purchase", (req, res) => {
  try {
    let { date } = req.body;

    let sql = `SELECT * FROM sales_detail
              WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_status = 'SOLD';`;

    mysql.Select(sql, "SalesDetail", (err, result) => {
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

router.post("/by-branch/daily-purchased-product", (req, res) => {
  try {
    let { date, branch } = req.body;

    let sql = `SELECT st_description as description FROM sales_detail
              WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_branch = ${branch} AND st_status = 'SOLD';`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      let data = [];

      if (result.length != 0) {
        data = ProcessDailyPurchasedProduct(result);
      }

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

router.post("/all-branch/daily-purchased-product", (req, res) => {
  try {
    let { date } = req.body;

    let sql = `SELECT st_description as description FROM sales_detail
              WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_status = 'SOLD';`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      let data = [];

      if (result.length != 0) {
        data = ProcessDailyPurchasedProduct(result);
      }

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

router.post("/all-branch/staff-sales", (req, res) => {
  try {
    let { date } = req.body;

    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      WHERE st_date BETWEEN '${date} 00:00:00' AND '${date} 23:59:59' AND st_status = 'SOLD'`;

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

router.post("/by-branch/staff-sales", (req, res) => {
  try {
    let { branch, date } = req.body;

    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      WHERE st_date BETWEEN '${date} 00:00:00' AND '${date} 23:59:59' AND st_branch = '${branch}' AND st_status = 'SOLD'`;

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

    let { date, branch } = req.body;

    const parts = date.split("-");

    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    let sql_select = `
          SELECT st_description as description, st_detail_id as detailid, st_total as total
          FROM sales_detail
          WHERE MONTH(st_date) IN (${month}) AND YEAR(st_date) IN (${year}) AND st_status = 'SOLD'`;

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
  console.log("ProcessDailyPurchasedProduct:", data);

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

  const overallQuantityArray = Array.from(
    overallQuantityMap,
    ([productName, quantity]) => ({ productName, quantity })
  );
  const overallPriceArray = Array.from(
    overallPriceMap,
    ([productName, totalPrice]) => ({ productName, totalPrice })
  );

  const combinedArray = overallQuantityArray.map((item) => ({
    ...item,
    totalPrice:
      overallPriceArray.find(
        ({ productName }) => productName === item.productName
      )?.totalPrice || 0,
  }));

  return combinedArray;
}
