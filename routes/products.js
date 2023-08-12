var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('products');
});

module.exports = router;


router.get('/load', (req, res) => {
  try {
      let sql = `select * from master_product`;

      mysql.Select(sql, 'MasterProduct', (err, result) => {
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
      let productid = req.body.productid;
      let description = req.body.description;
      let productimage = req.body.productimage;
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = "Ralph Lauren Santos";
      let createdate = helper.GetCurrentDatetime();
      let data = [];

      let sql_check = `select * from master_product where mp_productid='${productid}'`;

      mysql.Select(sql_check, 'MasterProduct', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
              data.push([
                  productid,
                  description,
                  productimage,
                  status,
                  createdby,
                  createdate
              ])
      
              mysql.InsertTable('master_product', data, (err, result) => {
                  if (err) console.error('Error: ', err);
      
                  console.log(result);
      
                  res.json({
                      msg: 'success',
                  })
              })
          }
      })
  }catch (error) {
      res.json({
          msg: error
      })
  }
})

router.post('/status', (req, res) => {
  try {
      let productid = req.body.productid;
      let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
      let data = [status, productid];
      console.log(data);

      let sql_Update = `UPDATE master_product 
                    SET mp_status = ?
                    WHERE mp_productid = ?`;

      mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error('Error: ', err);

          res.json({
              msg: 'success',
          });
      });
      
  } catch (error) {
      res.json({
          msg: error
      });
  }
});