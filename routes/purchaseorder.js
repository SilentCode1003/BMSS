var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('purchaseorder',{
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
      let sql = `select * from purchase_order`;

      mysql.Select(sql, 'PurchaseOrder', (err, result) => {
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

router.post('/save', (req, res) => {
  try {
      let vendorid = req.body.vendorid;
      let orderdate = req.body.orderdate;
      let deliverydate = req.body.deliverydate;
      let totalamount = req.body.totalamount;
      let paymentterms = req.body.paymentterms;
      let deliverymethod = req.body.deliverymethod;
      let poiData = req.body.poiData;
      let status = dictionary.GetValue(dictionary.PND());
      let data = [];

      data.push([
        vendorid,
        orderdate,
        deliverydate,
        totalamount,
        paymentterms,
        deliverymethod,
        status
      ])

      mysql.InsertTable('purchase_order', data, (err, result) => {
          if (err) console.error('Error: ', err);

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
      let orderid = req.body.orderid;
      let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.APD())
        : dictionary.GetValue(dictionary.PND());
      let data = [status, orderid];
      console.log(data);
  
      let sql_Update = `UPDATE purchase_order 
                       SET po_status = ?
                       WHERE po_orderid = ?`;
  
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
    let orderid = req.body.orderid;
    let status =
    req.body.status == dictionary.GetValue(dictionary.PND())
      ? dictionary.GetValue(dictionary.CND())
      : dictionary.GetValue(dictionary.PND());
    let data = [status, orderid];
    console.log(data);

    let sql_Update = `UPDATE purchase_order 
                      SET po_status = ?
                      WHERE po_orderid = ?`;

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