var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('materialcount',{
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
      let sql = `select * from production_material_count`;

      mysql.Select(sql, 'ProductionMaterialCount', (err, result) => {
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
        let materialdata = req.body.materialdata;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let rowData = [];

        materialdata.forEach(function(item, index) {
            let productid = item.productid;
            let quantity = item.quantity;
            let unit = item.unit;

            let sql_check = `select * from production_material_count where pmc_productid='${productid}'`;

            mysql.Select(sql_check, 'ProductionMaterialCount', (err, result) => {
                if (err) console.error('Error: ', err);
                
                if (result.length != 0) {
                    let getquantity = `select pmc_quantity as existingquantity from production_material_count where pmc_productid='${productid}'`;

                    mysql.SelectResult(getquantity, (err, result) => {
                        if (err) { return res.json({msg: err,});}
                        let currentQuantity = result[0].existingquantity;
                        let totalQuantity = parseFloat(currentQuantity) + parseFloat(quantity);
                        let sql_Update = `UPDATE production_material_count SET pmc_quantity = ? WHERE pmc_productid = ?`;

                        let data = [
                            totalQuantity,
                            productid
                        ];
                        console.log(data);

                        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                            if (err) console.error('Error: ', err);
                            res.json({
                                msg: 'success',
                            });
                        });
                    });
                    
                }else {
                    let rowData = []
                    rowData.push([
                        productid,
                        quantity,
                        unit,
                        status,
                        createdby,
                        createdate
                    ])
                    console.log(rowData)
                    mysql.InsertTable('production_material_count', rowData, (err, result) => {
                        if (err) console.error('Error: ', err);
            
                        console.log(result);
            
                        res.json({
                            msg: 'success',
                        });
                    })
                }
            })
        });
  
    } catch (error) {
        res.json({
            msg: error
        })
    }
  })

router.post('/status', (req, res) => {
    try {
        let countid = req.body.countid;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, countid];
        console.log(data);

        let sql_Update = `UPDATE production_material_count 
                       SET pmc_status = ?
                       WHERE pmc_countid = ?`;


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

router.post('/edit', (req, res) => {
    try {
        let countid = req.body.countid;
        let unit = req.body.unit;
        
        let data = [countid, unit];
         
        let sql_Update = `UPDATE production_material_count 
                       SET pmc_unit = ?
                       WHERE pmc_countid = ?`;
        
        let sql_check = `SELECT * FROM production_material_count WHERE pmc_unit='${countid}'`;


        mysql.Select(sql_check, 'MasterPositionType', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length == 1) {
                return res.json({
                    msg: 'duplicate'
                });
            } else {
                mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                    if (err) console.error('Error: ', err);

                    console.log(result);

                    res.json({
                        msg: 'success',
                    });
                });
            }
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
});

router.post("/getcurrentquantity", (req, res) => {
    try {
      let productid = req.body.productid;
      let sql = `select pmc_quantity as currentquantity from production_material_count where pmc_productid='${productid}'`;
  
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