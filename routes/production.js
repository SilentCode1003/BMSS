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
  
        mysql.Select(sql, 'production', (err, result) => {
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
        let productiononline = req.body.productiononline;
        let supervisorid = req.body.supervisorid;
        let notes = req.body.notes;
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
                    productiononline,
                    supervisorid,
                    notes
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

