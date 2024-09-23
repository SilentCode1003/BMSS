var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')

/* GET home page. */
router.get('/', function (req, res, next) {
  const currentDate = new Date().toISOString().split('T')[0]
  Validator(req, res, 'materialcost')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `select * from master_material_cost`

    mysql.Select(sql, 'MasterMaterialCost', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      console.log(helper.GetCurrentDatetime())

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

router.post('/save', (req, res) => {
  try {
    let materialname = req.body.materialname
    let unitcost = req.body.unitcost
    let unit = req.body.unit
    let status = dictionary.GetValue(dictionary.ACT())
    let createdby = req.session.fullname
    let createdate = helper.GetCurrentDatetime()
    let data = []

    //let dataposition = [];

    //#region Position
    // let check_position_name = `select * from master_position_type where mpt_positionname='${positionname}'`;
    // mysql.Select(check_position_name, "MasterPositionType", (err, result) => {
    //   if (err) console.error("Error: ", err);

    //   if (result.length != 0) {
    //   } else {
    //     dataposition.push([positionname, status, createdby, createdate]);

    //     mysql.InsertTable(
    //       "master_position_type",
    //       dataposition,
    //       (err, result) => {
    //         if (err) console.error("Error: ", err);
    //       }
    //     );
    //   }
    // });
    //#endregion Position

    let sql_check = `select * from master_material_cost where mmc_materialname='${materialname}'`

    mysql.Select(sql_check, 'MasterMaterialCost', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        data.push([materialname, unitcost, unit, status, createdby, createdate])

        mysql.InsertTable('master_material_cost', data, (err, result) => {
          if (err) console.error('Error: ', err)

          //console.log(result);

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/status', (req, res) => {
  try {
    let materialid = req.body.materialid
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT())
    let data = [status, materialid]
    console.log(data)

    let sql_Update = `UPDATE master_material_cost 
                    SET mmc_status = ?
                    WHERE mmc_materialid = ?`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      res.json({
        msg: 'success',
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/edit', (req, res) => {
  try {
    let materialid = req.body.materialid
    let materialname = req.body.materialname
    let unitcost = req.body.unitcost
    let unit = req.body.unit

    let data = []
    let sql_Update = `UPDATE master_material_cost SET`

    if (materialname) {
      sql_Update += ` mmc_materialname = ?,`
      data.push(materialname)
    }

    if (unitcost) {
      sql_Update += ` mmc_unitcost = ?,`
      data.push(unitcost)
    }

    if (unit) {
      sql_Update += ` mmc_unit = ?,`
      data.push(unit)
    }

    sql_Update = sql_Update.slice(0, -1)
    sql_Update += ` WHERE mmc_materialid = ?;`
    data.push(materialid)

    let sql_check = `SELECT * FROM master_material_cost WHERE mmc_materialid='${materialid}'`

    mysql.Select(sql_check, 'MasterMaterialCost', (err, result) => {
      if (err) {
        console.error('Error: ', err)
        return res.json({
          msg: 'error',
        })
      }

      if (result.length !== 1) {
        return res.json({
          msg: 'notexist',
        })
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error('Error: ', err)
          //console.log(result);

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    res.json({
      msg: 'error',
    })
  }
})
