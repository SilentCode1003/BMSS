var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "productiontransfer");
});

module.exports = router;

router.get('/load', (req, res) => {
    try {
        let sql = `select * from production_transfer`;

        mysql.Select(sql, 'ProductionTransfer', (err, result) => {
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
        let branchid = req.body.branchid;
        let quantity = req.body.quantity;
        let status = dictionary.GetValue(dictionary.PND());
        let createdby = req.session.fullname;
        let createdate = helper.GetCurrentDatetime();
        let accesstype = req.session.accesstype;
        let branch = req.session.branchid;
        let fullname = req.session.fullname;
        let data = [];

        data.push([
            productid,
            quantity,
            branchid,
            status,
            createdby,
            createdate
        ])

        mysql.InsertTable('production_transfer', data, (err, result) => {
            if (err) console.error('Error: ', err);

            console.log(result);
            Notification(accesstype, branch, fullname)
                .then((response) => {
                    console.log(response);
                }).catch((err) => {
                    console.log(err);
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

router.post("/cancel", (req, res) => {
    try {
        let transferid = req.body.transferid;
        let status =
            req.body.status == dictionary.GetValue(dictionary.PND())
                ? dictionary.GetValue(dictionary.CND())
                : dictionary.GetValue(dictionary.PND());
        let data = [status, transferid];
        console.log(data);

        let sql_Update = `UPDATE production_transfer 
                      SET pt_status = ?
                      WHERE pt_transferid = ?`;

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

router.post("/approve", (req, res) => {
    try {
        let transferid = req.body.transferid;
        let status =
            req.body.status == dictionary.GetValue(dictionary.INP())
                ? dictionary.GetValue(dictionary.CND())
                : dictionary.GetValue(dictionary.INP());
        let data = [status, transferid];
        console.log(data);

        let sql_Update = `UPDATE production_transfer 
                      SET pt_status = ?
                      WHERE pt_transferid = ?`;

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

function Notification(accesstype, branch, fullname){
    return new Promise((resolve, reject) => {
      
      if(accesstype == "Manager"){
        SelectUser()
        .then((user) => {
          user.forEach(userID => {
            let notification_data = [
              "PRODUCTION TRANSFER",
              userID,
              branch,
              `${fullname} has requested a Production Transfer`,
              "UNREAD",
              helper.GetCurrentDatetime(),
            ]
  
            mysql.InsertTable("request_notification", [notification_data] ,(err, result) => {
                if (err) console.error("Error:)", err);
                console.log(result);
              }
            );
          });
          resolve("Notification Pushed")
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }
  
  function SelectUser() {
    return new Promise((resolve, reject) => {
  
      let user_check = `SELECT 
          mu_usercode as userid, mu_employeeid as employeeid, mat_accessname as accesstype, mu_status as status, mu_branchid as branchid 
        FROM salesinventory.master_user 
        INNER JOIN master_access_type on mat_accesscode = mu_accesstype
        WHERE mu_status = 'ACTIVE';`;
  
      mysql.SelectResult(user_check, (err, result) => {
        if (err) reject(err);
        // console.log('3rd phase: ', result)
        if (result.length == 0) {
          reject("no data");
        } else {
          let selecteduser = [];
          result.forEach((item) => {
            let userid = item.userid;
            let employeeid = item.employeeid;
            let accesstype = item.accesstype;
            let status = item.status;
            let userbranchid = item.branchid;
  
            if (accesstype == "Owner") {
              selecteduser.push(userid);
            }
          });
  
          resolve(selecteduser);
        }
      });
    });
  }