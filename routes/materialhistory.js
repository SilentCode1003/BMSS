const express = require('express')
const router = express.Router()

const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Logger } = require('./repository/logger')
const { Validator } = require('./controller/middleware')
const { SelectAll, Query, Transaction, Check } = require('./utility/query.util')

router.get('/', function (req, res, next) {
  Validator(req, res, 'materialhistory')
})

router.get('/load', async (req, res) => {
  try {
    const selectAll = `SELECT 
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
                  ELSE '' END as notes,
                  CASE WHEN pmh_type = 'PRODUCTION' THEN mp_description 
                  ELSE mpm_productname
                  END as description
                  FROM salesinventory.production_material_history
                  INNER JOIN production_material_count ON pmh_countId = pmc_countid
                  INNER JOIN production_materials ON pmc_productid = mpm_productid
                  INNER JOIN production ON p_productionid = pmh_movementId
                  INNER JOIN master_product ON p_productid = mp_productid
                  ORDER BY pmh_id DESC`

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
