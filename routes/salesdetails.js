var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "salesdetails");
});

module.exports = router;

router.post("/close", (req, res) => {
  try {
    let notifid = req.body.notifid;
    let status = "CLOSED";

    let data = [status, notifid];

    let sql_Update = `UPDATE notification 
                       SET n_status = ?
                       WHERE n_id = ?`;

    let sql_check = `SELECT * FROM notification WHERE n_id='${notifid}'`;

    mysql.Select(sql_check, "Notification", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
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
      msg: error,
    });
  }
});

router.post("/read", (req, res) => {
  try {
    let notifid = req.body.notifid;
    let status = "READ";

    let data = [status, notifid];

    let sql_Update = `UPDATE notification 
                       SET n_status = ?
                       WHERE n_id = ?`;

    let sql_check = `SELECT * FROM notification WHERE n_id='${notifid}'`;

    mysql.Select(sql_check, "Notification", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 1) {
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
      msg: error,
    });
  }
});

router.post("/load", (req, res) => {
  try {
    const shift = req.body.shift;
    const dateRange = req.body.dateRange;
    const posid = req.body.posid;

    let sql = `SELECT * FROM sales_detail`;

    if (shift || dateRange || posid) {
      sql += " WHERE ";

      const conditions = [];

      if (shift) {
        conditions.push(`st_shift = ${shift}`);
      }

      if (dateRange) {
        const [startDate, endDate] = dateRange.split(" to ");
        conditions.push(
          `st_date BETWEEN '${startDate} 00:00' AND '${endDate} 23:59'`
        );
      }

      if (posid) {
        conditions.push(`st_pos_id = ${posid}`);
      }

      sql += conditions.join(" AND ");
    }

    console.log(sql);

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

router.post("/save", (req, res) => {
  try {
    let detailid = req.body.detailid;
    let date = req.body.date;
    let posid = req.body.posid;
    let shift = req.body.shift;
    let paymenttype = req.body.paymenttype;
    let referenceid = req.body.referenceid;
    let paymentname = req.body.paymentname;
    let description = req.body.description;
    let total = req.body.total;
    let cashier = req.body.cashier;
    let cash = req.body.cash;
    let ecash = req.body.ecash;
    let branch = req.body.branch;
    let discountdetail = req.body.discountdetail;
    let data = [];

    let sql_check = `select * from sales_detail where st_detail_id='${detailid}'`;

    mysql.Select(sql_check, "SalesDetail", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          detailid,
          date,
          posid,
          shift,
          paymenttype,
          description,
          total,
          cashier,
          branch,
        ]);

        mysql.InsertTable("sales_detail", data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          let activity = [];
          let items = [];
          let detail_description = JSON.parse(description);
          detail_description.forEach((key, item) => {
            let itemname = key.name;
            let price = parseFloat(key.price);
            let quantity = parseFloat(key.quantity);
            let total = price * quantity;
            items.push([detailid, date, itemname, price, quantity, total]);
          });

          //#region Sales Inventory History - Inventory Deduction
          InsertSalesInventoryHistory(
            detailid,
            date,
            branch,
            detail_description,
            cashier
          )
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              return res.json({
                msg: error,
              });
            });
          //#endregion

          //#region Sales Items
          mysql.InsertTable("sales_item", items, (err, result) => {
            if (err) console.error("Error:)", err);
            console.log(result);
          });

          activity.push([
            detailid,
            paymenttype == "SPLIT" ? "Cash" : paymenttype,
            cash,
            date,
          ]);
          //#endregion

          if (paymenttype === "SPLIT") {
            activity.push([detailid, paymentname, ecash, date]);
          }

          mysql.InsertTable("cashier_activity", activity, (err, result) => {
            if (err) console.error("Error: ", err);
            console.log(result);
          });

          if (paymenttype != "CASH") {
            let paymentdetails = [[detailid, paymentname, referenceid, date]];

            mysql.InsertTable(
              "epayment_details",
              paymentdetails,
              (err, result) => {
                if (err) console.error("Error: ", err);
                console.log(result);
              }
            );
          }

          //#region Discount
          if (discountdetail.length != 0) {
            let discountJSON = JSON.parse(req.body.discountdetail);
            discountJSON.forEach((key, item) => {
              let sales_discount = [
                [
                  key.detailid,
                  key.discountid,
                  JSON.stringify(key.customerinfo),
                  key.amount,
                ],
              ];

              InsertSalesDiscount(sales_discount)
                .then((result) => {
                  console.log(result);
                })
                .catch((error) => {
                  return res.json({
                    msg: error,
                  });
                });
            });
          }
          //#endregion

          //#region Promo
          let currentdate = helper.GetCurrentDate();
          GetPromo(currentdate)
            .then((result) => {
              if (result.length != 0) {
                let condition = parseFloat(result[0].condition);
                let promoid = result[0].promoid;
                let sales_promo = [[promoid, detailid]];

                if (total > condition) {
                  mysql.InsertTable(
                    "sales_promo",
                    sales_promo,
                    (err, result) => {
                      if (err) console.error("Error: ", err);

                      console.log(result);
                    }
                  );
                }
              }
            })
            .catch((error) => {
              return res.json({
                msg: error,
              });
            });

          //#endregion

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

router.post("/getdetailid", (req, res) => {
  try {
    let posid = req.body.posid;
    let sql = `select st_detail_id as detailid from sales_detail where st_pos_id='${posid}' order by st_detail_id desc limit 1`;
    let receipt = `${posid}00000000`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        res.json({
          msg: "success",
          data: result[0].detailid,
        });
      } else {
        res.json({
          msg: "success",
          data: receipt,
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getdetails", (req, res) => {
  try {
    const detailid = req.body.detailid;

    let sql = `select
    st_detail_id as ornumber,
    st_date as ordate,
    st_description as ordescription,
    st_payment_type as orpaymenttype,
    st_pos_id as posid,
    st_shift as shift,
    st_cashier as cashier,
    st_total as total,
    ed_type as epaymentname,
    ed_referenceid as referenceid,
    ca_paymenttype as  paymentmethod,
    ca_amount as amount
    from sales_detail
    left join epayment_details on sales_detail.st_detail_id = epayment_details.ed_detailid
    left join cashier_activity on sales_detail.st_detail_id = cashier_activity.ca_detailid
    where st_detail_id='${detailid}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
          data: result,
        });
      }
      let data = [];
      result.forEach((key, item) => {
        data.push({
          ornumber: key.ornumber,
          ordate: key.ordate,
          ordescription: key.ordescription,
          orpaymenttype: key.orpaymenttype,
          posid: key.posid,
          shift: key.shift,
          cashier: key.cashier,
          total: key.total,
          epaymentname: key.epaymentname == null ? "" : key.epaymentname,
          referenceid: key.referenceid == null ? "" : key.referenceid,
          paymentmethod: key.paymentmethod,
          amount: key.amount,
        });
      });

      console.log(data);
      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
      data: "",
    });
  }
});

router.post("/getdescription", (req, res) => {
  try {
    let daterange = req.body.daterange;
    let [startDate, endDate] = daterange.split(' - ');

    let formattedStartDate = startDate.split('/').reverse().join('-');
    let formattedEndDate = endDate.split('/').reverse().join('-');

    formattedStartDate = formattedStartDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$3-$2');
    formattedEndDate = formattedEndDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$3-$2');

    let sql_select = `
        SELECT st_description
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59'
    `;
    
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
      if(result == ''){
        console.log("NO DATA!")
      }else{
        console.log(result)
        console.log(sql_select)
      }
    });
  } catch (error) {
    res.json({
      msg: "error",
      error: error,
    });
  }
});

router.get("/yearly", (req, res) => {
  try {
    let sql = `SELECT MONTH(st_date) as month, YEAR(st_date) as year, st_branch, SUM(CAST(st_total AS DECIMAL(10, 2))) AS total
      FROM sales_detail
      GROUP BY YEAR(st_date), MONTH(st_date), st_branch, st_description
      ORDER BY YEAR(st_date), MONTH(st_date), st_branch, st_description;`;

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

//#region Functions
function GetPromo(currentdate) {
  return new Promise((resolve, reject) => {
    let status = dictionary.GetValue(dictionary.ACT());
    let sql = `select * from promo_details where '${currentdate}' between pd_startdate and pd_enddate and pd_status='${status}'`;

    mysql.Select(sql, "PromoDetails", (err, result) => {
      if (err) reject(err);

      console.log(result);

      resolve(result);
    });
  });
}

function InsertSalesDiscount(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable("sales_discount", data, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}

function InsertSalesInventoryHistory(detailid, date, branch, data, cashier) {
  return new Promise((resolve, reject) => {
    data.forEach((key, item) => {
      let itemname = key.name;
      let quantity = parseFloat(key.quantity);
      let sql_product = `select mp_productid as productid from master_product where mp_description='${itemname}'`;
      mysql.SelectResult(sql_product, (err, result) => {
        if (err) reject(err);

        console.log(result);
        let productid = result[0].productid;

        let details = [[detailid, date, productid, branch, quantity]];
        let inventoryid = `${productid}${branch}`;
        let inventory_history = [
          [
            inventoryid,
            quantity,
            dictionary.GetValue(dictionary.SLD()),
            date,
            cashier,
          ],
        ];

        mysql.InsertTable("sales_inventory_history", details, (err, result) => {
          if (err) reject(err);

          console.log(result);

          let check_product_inventory = `select pi_quantity as quantity from product_inventory where pi_inventoryid='${inventoryid}'`;
          mysql.SelectResult(check_product_inventory, (err, result) => {
            if (err) reject(err);

            console.log(result);

            let currentquantity = parseFloat(result[0].quantity);
            let deductionquantity = parseFloat(quantity);
            let difference = currentquantity - deductionquantity;

            let update_product_inventory =
              "update product_inventory set pi_quantity = ? where pi_inventoryid = ?";
            let product_inventory = [difference, inventoryid];

            UpdateProductInventory(update_product_inventory, product_inventory)
              .then((result) => {
                console.log(result);

                mysql.InsertTable(
                  "inventory_history",
                  inventory_history,
                  (err, result) => {
                    if (err) console.log("Error: ", err);

                    console.log(result);
                  }
                );
              })
              .catch((error) => {
                reject(error);
              });
          });
        });
      });
    });

    resolve("success");
  });
}

router.post("/test", (req, res) => {
  try {
  let {branchid, difference, inventoryid} = req.body
    console.log("initial log: ", branchid, difference, inventoryid)

    Notification(inventoryid, difference, branchid)
    .then((result) => {
      console.log("Test: ", result);
    }).catch((error) => {
      console.log(error)
    });

    res.json({
      msg: 'success',
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

function UpdateProductInventory(sql, data) {
  return new Promise((resolve, reject) => {
    mysql.UpdateMultiple(sql, data, (err, result) => {
      if (err) reject(err);

      console.log(result);
      resolve(result);
    });
  });
}

function Notification(inventoryid, difference, branch){
  return new Promise((resolve, reject) => {
    if(difference <= 15){
      let check_notification = `SELECT 
          n_id as id, n_userid as userid, n_inventoryid as inventoryid, n_branchid as branchid, 
          n_quantity as quantity, n_message as message, n_status as status, n_checker as checker
        FROM notification WHERE n_inventoryid = '${inventoryid}'`;

      mysql.SelectResult(check_notification, (err, result) => {
        if(err){
          reject(err)
        }
        console.log('initial phase[existing]: ', result);
        // console.log("result: ", result);
        // resolve(result);

        if(result.length != 0){
          let existing = [];
          let counter = 0;
          result.forEach((item) => {
            counter += 1;
            let id = item.id;
            let checker = item.checker;
  
            if(checker == 1){
              // reject(id);
              console.log("existing: ", id, "status: ", checker)
              existing.push(id)
              // resolve('No notification pushed reason: ',"[ID]: ", id, "[Status] ", checker)
            }
            console.log("counter inside: ", counter)
          });
            console.log("counter outside: ", counter, "existing: ", existing)

          if (counter == result.length && existing.length == 0){
            SelectUser(branch)
            .then((validUser) => {

              validUser.forEach(userID => {

                let notification_data = [userID,
                    inventoryid,
                    branch,
                    difference,
                    "Low Stocks",
                    "UNREAD",
                    1,
                    helper.GetCurrentDatetime()
                ];
                
                console.log("to be inserted [existing phase]: ", notification_data)
  
                mysql.InsertTable("notification", [notification_data], (err, result) => {
                  if (err) console.error("Error:)", err);
                  console.log(result);
                });
              });
            }).catch((error) => {
              reject(error);
            });
            resolve('success');
          }else{
            resolve('No Notification Pushed!');
          }
        }else{
          console.log('initial phase: ');
          SelectUser(branch)
          .then((validUser) => {

            validUser.forEach(userID => {

              let notification_data = [
                parseInt(userID),
                parseInt(inventoryid),
                branch,
                parseInt(difference),
                "Low Stocks",
                "UNREAD",
                1,
                helper.GetCurrentDatetime()
              ]
              
              console.log("to be inserted: ", notification_data)
              mysql.InsertTable("notification", [notification_data], (err, result) => {
                if (err) console.error("Error:)", err);
                console.log(result);
              });
            });
          }).catch((error) => {
            reject(error);
          });
          resolve('success');
        }

      });
    }
  });
}

function SelectUser(branchid) {
  return new Promise((resolve, reject) => {
    console.log('second phase: ');

    let user_check = `SELECT 
        mu_usercode as userid, mu_employeeid as employeeid, mat_accessname as accesstype, mu_status as status, mu_branchid as branchid 
      FROM salesinventory.master_user 
      INNER JOIN master_access_type on mat_accesscode = mu_accesstype
      WHERE mu_status = 'ACTIVE';`

    mysql.SelectResult(user_check, (err, result) => {
      if(err) reject(err);
      // console.log('3rd phase: ', result)
      if(result.length == 0){
        reject('no data');
      }else{
        let selecteduser = [];
        result.forEach((item) => {
          let userid = item.userid;
          let employeeid = item.employeeid;
          let accesstype = item.accesstype;
          let status = item.status;
          let userbranchid = item.branchid;

          if(accesstype == 'Manager' && userbranchid == branchid ){
            selecteduser.push(userid);
          }
          if (accesstype == 'Owner'){
            selecteduser.push(userid);
          }
        });

        console.log("third phase selecting users: ", selecteduser)

        resolve(selecteduser);

      }

    });
  });
}

//#endregion
