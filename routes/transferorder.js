var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('transferorder',{
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
  });
});

function isAuthUser(req, res, next) {

  if (req.session.positiontype == "User" || req.session.positiontype == "Admin" || req.session.positiontype == "Developer" ) {
      next();
  }
  else {
      res.redirect('/login');
  }
};
module.exports = router;


router.get('/load', (req, res) => {
  try {
      let sql = `SELECT * FROM transfer_orders`;

      mysql.Select(sql, 'TransferOrders', (err, result) => {
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
          let toidata = req.body.toidata;

          toidata.forEach(function(item, index) {
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
                console.log(result)
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
      let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.APD())
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

