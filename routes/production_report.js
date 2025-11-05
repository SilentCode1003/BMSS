const express = require('express')
const router = express.Router()

const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const { SelectAll, Query, Check } = require('../repository/utility/query.util')
const {
  JsonResponseError,
  JsonResponseData,
  JsonResponseSuccess,
  JsonResponseExist,
} = require('../repository/helper/response')
const {
  SelectAllStatement,
  InsertStatement,
  GetCurrentDatetime,
  SelectStatement,
  SelectStatementCondition,
  UpdateStatement,
  DeleteStatement,
  InsertStatementNoPrefix,
  UpdateStatementNoPrefix,
  GetPreviousMonthFirstDay,
  GetCurrentMonthLastDay,
} = require('../repository/helper/customhelper')
const { BMSS } = require('../repository/model/bmms')
const { DataModeling } = require('../repository/model/bmssmodel')
const {
  Select,
  Insert,
  SelectWithCondition,
  Update,
  Delete,
} = require('../repository/helper/dnconnect')
const { UPSERT_STATUS } = require('../repository/helper/enums')
const { INF, MSTR, GetValue, INSD } = require('../repository/helper/dictionary')

router.get('/', function (req, res, next) {
  Validator(req, res, 'production_report')
})

router.get('/get-production-report', async (req, res) => {
  try {
    let startDate = GetPreviousMonthFirstDay(1);
    let endDate = GetCurrentMonthLastDay();
    let select_sql = SelectStatement(`
      select 
      p_notes as job_order, 
      p_startdate as start_date,
      p_enddate as end_date,
      mp_description as product,
      p_quantityproduced as request_quantity,
      ph_quantity as reported_quantity ,
      p_productionline as production_line
      from production
      inner join production_history on p_productionid = ph_productionid and ph_status = 'COMPLETED'
      inner join master_product on mp_productid = p_productid
      where p_startdate between ? and ?`,[startDate, endDate]);

      console.log(select_sql);
      

      //p_quantityproduced != ph_quantity

   let ProductionReportResult = await Select(select_sql);

   if(ProductionReportResult.length > 0){
    res.status(200).json(JsonResponseData(ProductionReportResult));
   }
   else{
    res.status(200).json(JsonResponseData([]));
   }

  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/filter/:startdate/:enddate', async (req, res) => {
  try {
    const { startdate, enddate } = req.params
    let select_sql = SelectStatement(`
      select 
      p_notes as job_order, 
      p_startdate as start_date,
      p_enddate as end_date,
      mp_description as product,
      p_quantityproduced as request_quantity,
      ph_quantity as reported_quantity ,
      p_productionline as production_line
      from production
      inner join production_history on p_productionid = ph_productionid and ph_status = 'COMPLETED'
      inner join master_product on mp_productid = p_productid
      where p_startdate between ? and ?`,[startdate, enddate]);

      console.log(select_sql);
      

      //p_quantityproduced != ph_quantity

   let ProductionReportResult = await Select(select_sql);

   if(ProductionReportResult.length > 0){
    res.status(200).json(JsonResponseData(ProductionReportResult));
   }
   else{
    res.status(200).json(JsonResponseData([]));
   }

  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

module.exports = router
