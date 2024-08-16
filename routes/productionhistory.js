var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'productionhistory')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT 
              ph_historyid AS id,
              p_startdate as startdate,
              p_enddate as enddate,
              ph_productionid AS productionId, 
              ph_quantity AS quantity, 
              mp_description AS productName, 
              me_fullname as supervisor,
              p_notes as notes,
              ph_date as timestamp,
              p_status as status
              FROM production_history 
              INNER JOIN production ON p_productionid = ph_productionid 
              INNER JOIN master_product ON mp_productid = p_productid
              INNER JOIN master_employees ON me_employeeid = p_supervisorid
              WHERE p_status = ph_status
              ORDER BY ph_historyid DESC;`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }
      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})
