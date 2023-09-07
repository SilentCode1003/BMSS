var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('inventorycount',{
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
      let sql = `SELECT * FROM inventory_count`;

      mysql.Select(sql, 'InventoryCount', (err, result) => {
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
      let countdate = req.body.countdate;
      let locationid = req.body.locationid;
      let countby = req.body.countby;
      let countverification = req.body.countverification;
      let notes = req.body.notes;
      let data = [];

      data.push([
        countdate,
        locationid,
        countby,
        countverification,
        notes
      ])

      mysql.InsertTable('inventory_count', data, (err, result) => {
          if (err) console.error('Error: ', err);
          let countid = result[0]["id"];
          let icidata = req.body.icidata;

          icidata.forEach(function(item, index) {
              let productid = item.productid;
              let quantity = item.quantity;

              let rowData = [
                countid,
                productid,
                quantity,
            ];
        
             console.log(rowData);
              mysql.InsertTable('inventory_count_items', [rowData], (err, result) => {
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

