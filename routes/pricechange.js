var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pricechange');
});

module.exports = router;


router.get('/load', (req, res) => {
  try {
      let sql = `select * from price_change`;

      mysql.Select(sql, 'PriceChange', (err, result) => {
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
      let pricechangeid = req.body.pricechangeid;
      let productid = req.body.productid;
      let price = req.body.price;
      let status = req.body.status;
      let createdby = req.body.createdby;
      let createddate = req.body.createddate;
      let data = [];

      let sql_check = `select * from price_change where pc_price_change_id='${pricechangeid}'`;

      mysql.Select(sql_check, 'PriceChange', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
                  msg: 'exist'
              })
          } else {
              data.push([
                  pricechangeid,
                  productid,
                  price,
                  status,
                  createdby,
                  createddate
              ])

              mysql.InsertTable('price_change', data, (err, result) => {
                  if (err) console.error('Error: ', err);

                  console.log(result);

                  res.json({
                      msg: 'success',
                  })
              })
          }
      })
  } catch (error) {
      res.json({
          msg: error
      })
  }
})