var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET users listing. */
router.get('/', isAuthUser, function(req, res, next) {
  res.render('products',{
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
        let description = req.body.description;
        let price = req.body.price;
        let productimage = req.body.productimage;
        let barcode = req.body.barcode;
        let category = req.body.category;
        let quantity = req.body.quantity;
        let branchid = req.body.branchid;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let productid = '';
        let previousprice= '';
        let pricechange = '';
        let pricechangedate = '';
        let dataproductprice = [];
        let datacategory = [];
        let data = [];
        let productinventory = [];

        let check_category = `select * from master_category where mc_categoryname='${category}'`;
        mysql.Select(check_category, "MasterPositionType", (err, result) => {
            if (err) console.error("Error: ", err);
    
            if (result.length != 0) {
            } else {
                  datacategory.push([
                      category, 
                      status, 
                      createdby, 
                      createdate
                  ]);
        
                  mysql.InsertTable("master_category", datacategory, (err, result) => {
                    if (err) console.error("Error: ", err);
                  });
            }
        });

        //#region GENERAL SAVE
        let sql_check = `select * from master_product where mp_description='${description}'`;
        mysql.Select(sql_check, 'MasterProduct', (err, result) => {
            if (err) console.error('Error: ', err);

            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                
                data.push([
                    description,
                    price,
                    category,
                    barcode,
                    productimage,
                    status,
                    createdby,
                    createdate
                ])
        
                mysql.InsertTable('master_product', data, (err, result) => {
                    if (err) console.error('Error: ', err);

                    productid = result[0]['id'];
                    console.log(productid);

                    let check_inventory = `select * from product_inventory`;
                    mysql.Select(check_inventory, "ProductInventory", (err, result) => {
                        if (err) console.error("Error: ", err);
                
                        if (result.length != 0) {
                        } else {
                              productinventory.push([
                                  productid, 
                                  branchid,
                                  quantity, 
                              ]);
                    
                              mysql.InsertTable("product_inventory", productinventory, (err, result) => {
                                if (err) console.error("Error: ", err);
                              });
                        }
                    });

                    let check_data = `select * from product_price where pp_product_id='${productid}'`;
                    mysql.Select(check_data, "ProductPrice", (err, result) => {
                        if (err) console.error("Error: ", err);
                
                        if (result.length != 0) {
                        } else {
                              dataproductprice.push([
                                  productid, 
                                  description,
                                  barcode,
                                  productimage,
                                  price,
                                  category,
                                  previousprice,
                                  pricechange,
                                  pricechangedate,
                                  status, 
                                  createdby, 
                                  createdate
                              ]);
                    
                              mysql.InsertTable("product_price", dataproductprice, (err, result) => {
                                if (err) console.error("Error: ", err);
                              });
                        }
                    });
        
                    res.json({
                        msg: 'success',
                    })
                })
            }
        })
        //#endregion
        
   
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

router.post('/edit', (req, res) => {
    try {
        let productid = req.body.productid;
        let description = req.body.description;
        let productimage = req.body.productimage;
        
        let data = [];
        let sql_Update = `UPDATE master_product 
                    SET`;

        if (description) {
            sql_Update += ` mp_description = ?,`;
            data.push(description);
        }
        
        if (productimage) {
            sql_Update += ` mp_productimage = ?,`;
            data.push(productimage);
        }

        sql_Update = sql_Update.slice(0, -1); 
        sql_Update += ` WHERE mp_productid = ?;`;
        data.push(productid);
        
        let sql_check = `SELECT * FROM master_product WHERE mp_description='${description}'`;

        let sql_Update_product_price = `UPDATE product_price 
                                    SET`;

        if (description) {
            sql_Update_product_price += ` pp_description = ?,`;
            data.push(description);
        }

        if (productimage) {
            sql_Update_product_price += ` pp_product_image = ?,`;
            data.push(productimage);
        }

        sql_Update_product_price = sql_Update_product_price.slice(0, -1);
        sql_Update_product_price += ` WHERE pp_product_id = ?;`;
        data.push(productid);

        mysql.Select(sql_check, 'MasterProduct', (err, result) => {
            if (err) {
                console.error('Error: ', err);
                return res.json({
                    msg: 'error'
                });
            }

            if (result.length === 1) {
                return res.json({
                    msg: 'duplicate'
                });
            } else {
                mysql.UpdateMultiple(sql_Update, data, (err, result) => {
                    if (err) console.error('Error: ', err);
                    console.log(result);
                });

                mysql.UpdateMultiple(sql_Update_product_price, data, (err, result) => {
                    if (err) console.error('Error: ', err);
                    console.log(result);
                });

                res.json({
                    msg: 'success',
                });
            }
        });
    } catch (error) {
        res.json({
            msg: 'error'
        });
    }
});

router.post('/getproduct', (req, res) => {
    try {
      let description = req.body.description;
      let sql = `select mp_productid, mp_description from master_product where mp_description = '${description}'`;
  
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
  });

router.get('/getproductdetails', (req, res) => {
    try {
        let productid = req.query.productid;
        console.log(productid)
        let sql = `select mp_description from master_product where mp_productid = '${productid}'`;

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
});

  
