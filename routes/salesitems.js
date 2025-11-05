var express = require('express')
var router = express.Router()

const { SelectResult } = require('../repository/helper/bmssdb')
const { SelectStatement } = require('../repository/helper/customhelper')
const dictionary = require('../repository/helper/dictionary')
const { Validator } = require('../repository/controller/middleware')
const { JsonResponseError, JsonResponseData } = require('../repository/helper/response')
const { Select } = require('../repository/helper/dnconnect')
const { DataModeling } = require('../repository/model/bmssmodel')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'salesitems')
})
module.exports = router

router.post('/getshiftitemsold', (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.body
    let sql = `select 
            case when si_total < 0 then dd_name else mp_description end as item,
            SUM(si_quantity) as quantity,
            SUM(si_total) as total from sales_detail
            inner join sales_item on st_detail_id = si_detail_id
            inner join master_product on si_item = mp_productid
            left join sales_discount on sd_detailid = si_detail_id
            left join discounts_details on dd_discountid = sd_discountid
            where st_detail_id between ? and ?
            and st_status = 'SOLD'
            group by case when si_total < 0 then dd_name else mp_description end
            order by item asc`
    let cmd_sql = SelectStatement(sql, [beginingreceipt, endingreceipt])
    SelectResult(cmd_sql, (err, result) => {
      if (err) {
        console.error(err)
        return res.json({
          msg: err,
        })
      }

      if (result.length != 0) {
        let data = []
        result.forEach((key, item) => {
          data.push({
            item: key.item,
            quantity: key.quantity,
            total: key.total,
          })
        })

        //console.log(data);
        res.json({
          msg: 'success',
          data: data,
        })
      } else {
        res.json({
          msg: 'success',
          data: result,
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/getshiftsummarypayment', (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.body
    let sql = `
    select ca_paymenttype as paymenttype,
    SUM(ca_amount) as total from sales_detail
    inner join cashier_activity on ca_detailid = st_detail_id
    where st_detail_id between ? and ?
    and st_status='SOLD'
    group by ca_paymenttype`
    let cmd_sql = SelectStatement(sql, [beginingreceipt, endingreceipt])
    SelectResult(cmd_sql, (err, result) => {
      if (err) {
        console.error(err)
        return res.json({
          msg: err,
        })
      }

      if (result.length != 0) {
        let data = []
        result.forEach((key, item) => {
          data.push({
            paymenttype: key.paymenttype,
            total: key.total,
          })
        })

        //console.log(data);
        res.json({
          msg: 'success',
          data: data,
        })
      } else {
        res.json({
          msg: 'success',
          data: result,
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.post('/getshiftstaffsales', (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.body
    let sql = `
    select
    st_cashier as salesstaff,
    sum(st_total) as total
    from sales_detail
    where st_detail_id between ? and ?
    and st_status='SOLD'
    group by st_cashier`
    let cmd_sql = SelectStatement(sql, [beginingreceipt, endingreceipt])
    SelectResult(cmd_sql, (err, result) => {
      if (err) {
        console.error(err)
        return res.json({
          msg: err,
        })
      }

      if (result.length != 0) {
        let data = []
        result.forEach((key, item) => {
          data.push({
            salesstaff: key.salesstaff,
            total: key.total,
          })
        })

        //console.log(data);
        res.json({
          msg: 'success',
          data: data,
        })
      } else {
        res.json({
          msg: 'success',
          data: result,
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/get-shift-service-sold/:beginingreceipt/:endingreceipt', async (req, res) => {
  try {
    const { beginingreceipt, endingreceipt } = req.params
    let sql = SelectStatement('select * from sales_detail where st_detail_id between ? and ?', [
      beginingreceipt,
      endingreceipt,
    ])

    let data = []

    let servicesSoldResult = await Select(sql)

    //console.log('Services Sold Result:', servicesSoldResult)

    for (var items of DataModeling(servicesSoldResult, 'st_')) {
      const { description } = items
      let itemsJsonArray = JSON.parse(description)

      itemsJsonArray.forEach((args) => {
        if (args.name.includes('Srv')) {
          //console.log(args.name, args.quantity, args.price)

          let idx = data.findIndex((item) => item.item === args.name)
          if (idx !== -1) {
            data[idx].quantity += args.quantity
            data[idx].total += parseFloat(args.quantity) * parseFloat(args.price)
          } else {
            data.push({
              item: args.name,
              quantity: args.quantity,
              price: args.price,
              total: parseFloat(args.quantity) * parseFloat(args.price),
            })
          }
        }
      })
    }

    res.status(200).json(JsonResponseData(data.sort((a, b) => a.item.localeCompare(b.item))))
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})
