var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");

/* GET home page. */
router.get("/", isAuthUser, function (req, res, next) {
  res.render("production", {
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
  });
});

function isAuthUser(req, res, next) {
  if (
    req.session.positiontype == "User" ||
    req.session.positiontype == "Admin" ||
    req.session.positiontype == "Developer"
  ) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;


router.get('/load', (req, res) => {
    try {
        let sql = `select * from production`;
  
        mysql.Select(sql, 'Production', (err, result) => {
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
        let productid = req.body.productid;
        let startdate = req.body.startdate;
        let enddate = req.body.enddate;
        let quantityproduced = req.body.quantityproduced;
        let productionline = req.body.productionline;
        let employeeid = req.body.employeeid;
        let notes = req.body.notes;
        let status = dictionary.GetValue(dictionary.PND());
        let data = [];
    
        let sql_check = `select * from production where p_productid='${productid}'`;
  
        mysql.Select(sql_check, 'Production', (err, result) => {
            if (err) console.error('Error: ', err);
  
            if (result.length != 0) {
                return res.json({
                    msg: 'exist'
                })
            } else {
                data.push([
                    productid,
                    startdate,
                    enddate,
                    quantityproduced,
                    productionline,
                    employeeid,
                    notes,
                    status
                ])
  
                mysql.InsertTable('production', data, (err, result) => {
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

router.post('/approve', async (req, res) => {
  try {
    const productionid = req.body.productionid;
    const productid = req.body.productid;
    const productionquantity = req.body.quantity;
    const status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.INP())
        : dictionary.GetValue(dictionary.PND());
    const data = [status, productionid];
    let deductdata = [];

    const sql = `select pc_components as components from product_component where pc_productid='${productid}'`;

    const result = await new Promise((resolve, reject) => {
      mysql.SelectResult(sql, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    const resultJson = JSON.parse(result[0].components);

    const updatedData = resultJson.map((item) => {
      const quantity = parseFloat(item.quantity);
      const materialid = item.materialid;
      const updatedQuantity = quantity * productionquantity;
      return {
        materialid: materialid,
        quantity: parseFloat(updatedQuantity),
      };
    });

    console.log(updatedData);

    for (const item of updatedData) {
      const deductquantity = `select pmc_quantity as existingquantity from production_material_count where pmc_productid='${item.materialid}'`;

      const deductResult = await new Promise((resolve, reject) => {
        mysql.SelectResult(deductquantity, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });

      if (deductResult[0].existingquantity != 0) {
        const currentQuantity = deductResult[0].existingquantity;
        const totalQuantity = parseFloat(currentQuantity) - parseFloat(item.quantity);
        const sql_Update = `UPDATE production_material_count SET pmc_quantity = ? WHERE pmc_productid = ?`;

        deductdata = [totalQuantity, item.materialid];

        console.log(deductdata);

        await new Promise((resolve, reject) => {
          mysql.UpdateMultiple(sql_Update, deductdata, (err, result) => {
            if (err) {
              console.error('Error:', err);
              reject(err);
            }
            console.log(result);
            resolve();
          });
        });
      } else {
        return res.json({ msg: 'insufficient' });
      }
    }

    // const sql_Update = `UPDATE production 
    //   SET p_status = ?
    //   WHERE p_productionid = ?`;

    // await new Promise((resolve, reject) => {
    //   mysql.UpdateMultiple(sql_Update, data, (err, result) => {
    //     if (err) {
    //       console.error('Error: ', err);
    //       reject(err);
    //     }
    //     resolve();
    //   });
    // });

    return res.json({
      msg: 'success',
      data: updatedData,
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }
});
