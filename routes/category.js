var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('category');
});

module.exports = router;

router.get('/load', (req, res) => {
  try {
      let sql = `select * from master_category`;

      mysql.Select(sql, 'MasterCategory', (err, result) => {
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
      let categoryname = req.body.categoryname;
      let status = dictionary.GetValue(dictionary.ACT());
      let createdby = "Ralph Lauren Santos";
      let createddate = helper.GetCurrentDatetime();
      let data = [];

      let sql_check = `select * from master_category where mc_categoryname='${categoryname}'`;

      mysql.Select(sql_check, 'MasterCategory', (err, result) => {
          if (err) console.error('Error: ', err);

          if (result.length != 0) {
              return res.json({
              msg: 'exist'
              })
          }else {
              data.push([
                  categoryname,
                  status,
                  createdby,
                  createddate
              ])
      
              mysql.InsertTable('master_category', data, (err, result) => {
                  if (err) console.error('Error: ', err);
      
                  console.log(result[0]['id']);
      
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
        let categorycode = req.body.categorycode;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, categorycode];
        console.log(data);

        let sql_Update = `UPDATE master_category 
                       SET mc_status = ?
                       WHERE mc_categorycode = ?`;


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