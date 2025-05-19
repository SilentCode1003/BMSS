const express = require('express')
const router = express.Router()

const dictionary = require('../repository/helper/dictionary')
const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('../repository/utility/query.util')
const {
  SelectStatement,
  GetCurrentMonthFirstDay,
  GetCurrentMonthLastDay,
  GetCurrentDay,
  GetCurrentDate,
} = require('../repository/helper/customhelper')

router.get('/', function (req, res, next) {
  Validator(req, res, 'materialhistory')
})

router.get('/load', async (req, res) => {
  try {
    let currentDay = GetCurrentDate()
    const selectAll = SelectStatement(
      `SELECT 
          pmh_id AS id, 
          pmh_countId AS countId, 
          pmh_baseQuantity AS baseQuantity, 
          pmh_movementUnit AS movementUnit,
          pmh_baseUnit AS baseUnit,
          pmh_convertedQuantity AS convertedQuantity, 
          pmh_movementId AS movementId, 
          pmh_type AS type, 
          pmh_date AS date, 
          pmh_stocksBefore AS stocksBefore,
          pmh_stocksAfter AS stocksAfter, 
          pmh_unitBefore AS unitBefore, 
          pmh_unitAfter AS unitAfter, 
          mpm_productname AS materialName,
          CASE WHEN pmh_type = 'PRODUCTION' THEN p_notes
          WHEN pmh_type = 'ADJUSTMENT' THEN pmsa_note
          ELSE ''
          END AS notes ,
          CASE WHEN pmh_type = 'PRODUCTION' 
          THEN mp_description
          ELSE mpm_productname
          END as description
          FROM salesinventory.production_material_history
          INNER JOIN production_material_count ON pmh_countId = pmc_countid
          INNER JOIN production_materials ON pmc_productid = mpm_productid
          INNER JOIN production ON p_productionid = pmh_movementId
          INNER JOIN master_product ON p_productid = mp_productid
          LEFT JOIN production_material_stock_adjustment ON pmsa_id = pmh_movementId AND pmh_type = 'ADJUSTMENT'
          WHERE pmh_date BETWEEN ? and ?
          ORDER BY pmh_id DESC
          LIMIT 2000`,
      [`${currentDay} 00:00:00`, `${currentDay} 23:59:59`]
    )

    const response = await Query(selectAll)

    res.status(200).json({
      msg: 'success',
      data: response,
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

router.get('/filter/:startdate/:enddate', async (req, res) => {
  try {
    const { startdate, enddate } = req.params
    const selectAll = SelectStatement(
      `SELECT 
          pmh_id AS id, 
          pmh_countId AS countId, 
          pmh_baseQuantity AS baseQuantity, 
          pmh_movementUnit AS movementUnit,
          pmh_baseUnit AS baseUnit,
          pmh_convertedQuantity AS convertedQuantity, 
          pmh_movementId AS movementId, 
          pmh_type AS type, 
          pmh_date AS date, 
          pmh_stocksBefore AS stocksBefore,
          pmh_stocksAfter AS stocksAfter, 
          pmh_unitBefore AS unitBefore, 
          pmh_unitAfter AS unitAfter, 
          mpm_productname AS materialName,
          CASE WHEN pmh_type = 'PRODUCTION' THEN p_notes
          WHEN pmh_type = 'ADJUSTMENT' THEN pmsa_note
          ELSE ''
          END AS notes ,
          CASE WHEN pmh_type = 'PRODUCTION' 
          THEN mp_description
          ELSE mpm_productname
          END as description
          FROM salesinventory.production_material_history
          INNER JOIN production_material_count ON pmh_countId = pmc_countid
          INNER JOIN production_materials ON pmc_productid = mpm_productid
          INNER JOIN production ON p_productionid = pmh_movementId
          INNER JOIN master_product ON p_productid = mp_productid
          LEFT JOIN production_material_stock_adjustment ON pmsa_id = pmh_movementId AND pmh_type = 'ADJUSTMENT'
          WHERE pmh_date BETWEEN ? and ?
          ORDER BY pmh_id DESC`,
      [`${startdate} 00:00:00`, `${enddate} 23:59:59`]
    )

    const response = await Query(selectAll)

    res.status(200).json({
      msg: 'success',
      data: response,
    })
  } catch (error) {
    res.status(400).json({
      msg: error,
    })
  }
})

module.exports = router
