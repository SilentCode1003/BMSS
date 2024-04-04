var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "transferorder");
});

module.exports = router;


router.get('/load', (req, res) => {
  try {
    let sql = `SELECT to_transferid as transferid, 
            to_fromlocationid as fromlocationid, 
            to_tolocationid as tolocationid, 
            from_loc.mb_branchname as fromlocbranchname,
            to_loc.mb_branchname as tolocbranchname,
            to_transferdate as transferdate,
            to_totalquantity as totalquantity, 
            to_status as status, 
            to_notes as notes 
          FROM transfer_orders
          INNER JOIN master_branch as from_loc ON to_fromlocationid = from_loc.mb_branchid
          INNER JOIN master_branch as to_loc ON to_tolocationid = to_loc.mb_branchid
          ORDER BY to_transferid DESC`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err
        })
      }
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

router.post('/save', (req, res) => {
  try {
    let fromlocationid = req.body.fromlocationid;
    let tolocationid = req.body.tolocationid;
    let transferdate = req.body.transferdate;
    let totalquantity = req.body.totalquantity;
    let status = dictionary.GetValue(dictionary.PND());
    let notes = req.body.notes;
    let data = [];

    data.push([
      fromlocationid,
      tolocationid,
      transferdate,
      totalquantity,
      status,
      notes
    ])

    mysql.InsertTable('transfer_orders', data, (err, result) => {
      if (err) console.error('Error: ', err);
      let transferid = result[0]["id"];
      let toidata = JSON.parse(req.body.toidata);

      toidata.forEach(function (item, index) {
        let productid = item.productid;
        let quantity = item.quantity;

        let rowData = [
          transferid,
          productid,
          quantity,
        ];

        console.log(rowData);
        mysql.InsertTable('transfer_order_items', [rowData], (err, result) => {
          if (err) console.error('Error: ', err);
          console.log("Data successfully inserted: " + result)
        })
      });

      res.json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.post("/approve", (req, res) => {
  try {
    let transferid = req.body.transferid;
    let frombranch = req.body.frombranch;
    let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.APD())
        : dictionary.GetValue(dictionary.PND());

    // let type = dictionary.GetValue(dictionary.TRF());
    // let createdby = req.session.fullname;
    // let createdate = helper.GetCurrentDatetime();
    let data = [status, transferid];
    console.log(data);

    let sql_Update = `UPDATE transfer_orders 
                       SET to_status = ?
                       WHERE to_transferid = ?`;

    let sql_select_transfer_items = `SELECT * FROM transfer_order_items WHERE toi_transferid = '${transferid}'`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      mysql.Select(sql_select_transfer_items, "TransferOrderItems", (err, result) => {
        if (err) console.error("Error: ", err);
        console.log(result);
        result.forEach(item => {
          let productid = item.productid;
          let quantity = item.quantity;
          let inventoryid = productid+frombranch;

          let select_inventory = `select pi_quantity from product_inventory where pi_inventoryid = '${productid}${frombranch}'`;
          console.log(`Inventory id: ${inventoryid}`)
          mysql.Select(select_inventory, 'ProductInventory', (err, result) => {
            if (err) {
              return res.json({
                msg: err
              })
            }
            currentquantity = result[0].quantity
            let sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`;

            let finalquantity = parseFloat(currentquantity) - parseFloat(quantity)
            let deduct_data = [finalquantity, inventoryid];

            mysql.UpdateMultiple(sql_add, deduct_data, (err, result) => {
              if (err) console.error("Error: ", err);
            });
          });

          // let rowData = [
          //   inventoryid,
          //   quantity,
          //   type,
          //   createdate,
          //   createdby,
          // ];

          // mysql.InsertTable('inventory_history', [rowData], (err, result) => {
          //   if (err) console.error('Error: ', err);
          //   console.log("Data successfully inserted: " + result)
          // })
        });
      })

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

router.post("/report", (req, res) => {
  try {
    let transferid = req.body.transferid;
    let branch = req.body.branch;
    let status =
      req.body.status == dictionary.GetValue(dictionary.APD())
        ? dictionary.GetValue(dictionary.CMP())
        : dictionary.GetValue(dictionary.APD());
    let type = dictionary.GetValue(dictionary.TRF());
    let createdby = req.session.fullname;
    let createdate = helper.GetCurrentDatetime();
    let data = [status, transferid];
    console.log(data);

    let sql_Update = `UPDATE transfer_orders 
                    SET to_status = ?
                    WHERE to_transferid = ?`;

    let sql_select_transfer_items = `SELECT * FROM transfer_order_items WHERE toi_transferid = '${transferid}'`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      mysql.Select(sql_select_transfer_items, "TransferOrderItems", (err, result) => {
        if (err) console.error("Error: ", err);
        console.log(result);
        result.forEach(item => {
          let productid = item.productid;
          let quantity = item.quantity;
          let inventoryid = productid+branch;

          let select_inventory = `select pi_quantity from product_inventory where pi_inventoryid = '${productid}${branch}'`;

          mysql.Select(select_inventory, 'ProductInventory', (err, result) => {
            if (err) {
              return res.json({
                msg: err
              })
            }
            currentquantity = result[0].quantity
            let sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`;

            let finalquantity = parseFloat(currentquantity) + parseFloat(quantity)
            let add_data = [finalquantity, inventoryid];

            mysql.UpdateMultiple(sql_add, add_data, (err, result) => {
              if (err) console.error("Error: ", err);
            });
          });

          let rowData = [
            inventoryid,
            quantity,
            type,
            createdate,
            createdby,
          ];

          mysql.InsertTable('inventory_history', [rowData], (err, result) => {
            if (err) console.error('Error: ', err);
            console.log("Data successfully inserted: " + result)
          })
        });
      })

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

router.post("/cancel", (req, res) => {
  try {
    let transferid = req.body.transferid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.CND())
        : dictionary.GetValue(dictionary.PND());
    let data = [status, transferid];
    console.log(data);

    let sql_Update = `UPDATE transfer_orders 
                    SET to_status = ?
                    WHERE to_transferid = ?`;

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

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

router.get('/loadsampleitem', (req, res) => {
  try {
    let sql = `select * from sample_itemlists`;

    mysql.Select(sql, 'SampleItemLists', (err, result) => {
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
});

router.post('/getitemdetails', (req, res) => {
  try {
    let description = req.body.description;
    let sql = `select * from sample_itemlists where sil_description = '${description}'`;

    mysql.Select(sql, 'SampleItemLists', (err, result) => {
      if (err) {
        return res.json({
          msg: err
        })
      }
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
});

router.post('/gettransferdetails', (req, res) => {
  try {
    let transferid = req.body.transferid;
    let sql = `select * from transfer_order_items where toi_transferid = '${transferid}'`;

    mysql.Select(sql, 'TransferOrderItems', (err, result) => {
      console.log(result)
      if (err) {
        return res.json({
          msg: err
        })
      }
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
});

router.post('/getapprovaldetails', (req, res) => {
  try {
    let transferid = req.body.transferid;
    let branchid = req.body.branchid;

    console.log("transferid: " + transferid, 'branchid: ' + branchid)
    let sql = `
      SELECT to_transferid as transferid, from_location.mb_branchname as fromlocation, to_fromlocationid as fromid, to_location.mb_branchname as tolocation, 
        to_tolocationid as toid, prod_desc.mp_description as productname, toi_productid as productid, toi_quantity as totransferquantity, pi_quantity as fromcurrentstocks 
      FROM transfer_orders
      INNER JOIN transfer_order_items ON toi_transferid = to_transferid
      INNER JOIN product_inventory  ON toi_productid = pi_productid
      INNER JOIN master_branch as from_location ON to_fromlocationid = from_location.mb_branchid
      INNER JOIN master_branch as to_location ON to_tolocationid = to_location.mb_branchid
      INNER JOIN master_product as prod_desc ON toi_productid = prod_desc.mp_productid
      WHERE to_transferid = '${transferid}' AND to_fromlocationid = '${branchid}' AND pi_branchid = '${branchid}' AND pi_productid = toi_productid;`;

    mysql.SelectResult(sql, (err, result) => {
      console.log(result)
      if (err) {
        return res.json({
          msg: err
        })
      }
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
});
