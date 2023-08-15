var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');

/* GET home page. */
router.get('/', function(req, res, next) {
    const currentDate = new Date().toISOString().split('T')[0];
    res.render('employees', { currentDate });
});

module.exports = router;

router.get('/load', (req, res) => {
    try {
        let sql = `select * from master_employees`;
  
        mysql.Select(sql, 'MasterEmployees', (err, result) => {
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
        let employeeid = req.body.employeeid;
        let fullname = req.body.fullname;
        let positionname = req.body.positionname;
        let contactinfo = req.body.contactinfo;
        let datehired = req.body.datehired;
        let status = dictionary.GetValue(dictionary.ACT());
        let createdby = "Ralph Lauren Santos";
        let createdate = helper.GetCurrentDatetime();
        let data = [];
        let dataposition = [];

        //#region Position
        let check_position_name = `select * from master_position_type where mpt_positionname='${positionname}'`;
        mysql.Select(check_position_name, "MasterPositionType", (err, result) => {
            if (err) console.error("Error: ", err);
    
            if (result.length != 0) {
            } else {
                dataposition.push([
                    positionname, 
                    status, 
                    createdby, 
                    createdate
                ]);
        
                mysql.InsertTable("master_position_type", dataposition, (err, result) => {
                    if (err) console.error("Error: ", err);
            });
            }
        });
        //#endregion Position
  
        let sql_check = `select * from master_employees where me_employeeid='${employeeid}'`;
  
        mysql.Select(sql_check, 'MasterEmployees', (err, result) => {
            if (err) console.error('Error: ', err);
  
            if (result.length != 0) {
                return res.json({
                msg: 'exist'
                })
            }else {
                data.push([
                    employeeid,
                    fullname,
                    positionname,
                    contactinfo,
                    datehired,
                    status,
                    createdby,
                    createdate
                ])
        
                mysql.InsertTable('master_employees', data, (err, result) => {
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
        let employeeid = req.body.employeeid;
        let status = req.body.status == dictionary.GetValue(dictionary.ACT()) ? dictionary.GetValue(dictionary.INACT()): dictionary.GetValue(dictionary.ACT());
        let data = [status, employeeid];
        console.log(data);

        let sql_Update = `UPDATE master_employees 
                    SET me_status = ?
                    WHERE me_employeeid = ?`;

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