var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { DataModeling } = require('./model/bmssmodel')
const { Logger } = require('./repository/logger')
const { SendEmail } = require('./repository/mailer')
const { Check, Query } = require('./utility/query.util')
const verifyJWT = require('../middleware/authenticator')

require('dotenv').config()

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'salesdetails')
})

module.exports = router

router.post('/close', (req, res) => {
  try {
    let notifid = req.body.notifid
    let status = 'CLOSED'

    let data = [status, notifid]

    let sql_Update = `UPDATE notification 
                       SET n_status = ?
                       WHERE n_id = ?`

    let sql_check = `SELECT * FROM notification WHERE n_id='${notifid}'`

    mysql.Select(sql_check, 'Notification', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 1) {
        return res.json({
          msg: 'notexist',
        })
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error('Error: ', err)

          // //console.log(result);

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

router.post('/read', (req, res) => {
  try {
    let notifid = req.body.notifid
    let status = 'READ'

    let data = [status, notifid]

    let sql_Update = `UPDATE notification 
                       SET n_status = ?
                       WHERE n_id = ?`

    let sql_check = `SELECT * FROM notification WHERE n_id='${notifid}'`

    mysql.Select(sql_check, 'Notification', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 1) {
        return res.json({
          msg: 'notexist',
        })
      } else {
        mysql.UpdateMultiple(sql_Update, data, (err, result) => {
          if (err) console.error('Error: ', err)

          // //console.log(result);

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

router.post('/load', (req, res) => {
  try {
    const shift = req.body.shift
    const dateRange = req.body.dateRange
    const posid = req.body.posid

    let sql = `SELECT st_detail_id as detailid, st_cashier as cashier, mb_branchname as branch, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype, st_total as total, st_status as status
    FROM salesinventory.sales_detail
    INNER JOIN master_branch ON mb_branchid = st_branch`

    if (shift || dateRange || posid) {
      sql += ' WHERE '

      const conditions = []

      if (shift) {
        conditions.push(`st_shift = '${shift}'`)
      }

      if (dateRange) {
        const [startDate, endDate] = dateRange.split(' to ')
        conditions.push(`st_date BETWEEN '${startDate} 00:00' AND '${endDate} 23:59'`)
      }

      if (posid) {
        conditions.push(`st_pos_id = '${posid}'`)
      }

      sql += conditions.join(' AND ')
    }

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

router.post('/save', verifyJWT, (req, res) => {
  try {
    let detailid = req.body.detailid
    let date = req.body.date
    let posid = req.body.posid
    let shift = req.body.shift
    let paymenttype = req.body.paymenttype
    let referenceid = req.body.referenceid
    let paymentname = req.body.paymentname
    let description = req.body.description
    let total = req.body.total
    let cashier = req.body.cashier
    let cash = req.body.cash
    let ecash = req.body.ecash
    let branch = req.body.branch
    let discountdetail = req.body.discountdetail
    const status = dictionary.GetValue(dictionary.SLD())
    let data = []

    let sql_check = `select * from sales_detail where st_detail_id='${detailid}'`

    mysql.Select(sql_check, 'SalesDetail', (err, result) => {
      if (err) console.error('Error: ', err)

      if (result.length != 0) {
        return res.json({
          msg: 'exist',
        })
      } else {
        data.push([
          detailid,
          date,
          posid,
          shift,
          paymenttype,
          description,
          total,
          cashier,
          branch,
          status,
        ])

        mysql.InsertTable('sales_detail', data, (err, result) => {
          if (err) console.error('Error: ', err)
          console.log('sales details res:', result)

          let activity = []
          let items = []
          let detail_description = JSON.parse(description)
          detail_description.forEach((key, item) => {
            let itemid = key.id
            let price = parseFloat(key.price)
            let quantity = parseFloat(key.quantity)
            let total = price * quantity
            items.push([detailid, date, itemid, price, quantity, total])
          })

          //#region Sales Inventory History - Inventory Deduction
          InsertSalesInventoryHistory(detailid, date, branch, detail_description, cashier, detailid)
            .then((result) => {
              console.log(`$Inventory Sales History: ${result}`)
            })
            .catch((error) => {
              console.error(`Inventory Error: ${error}`)
              return res.json({
                msg: error,
              })
            })
          //#endregion

          //#region Sales Items
          mysql.InsertTable('sales_item', items, (err, result) => {
            if (err) console.error('Error:)', err)
            console.log(`$Sales Item: ${result}`)
          })

          activity.push([detailid, paymenttype == 'SPLIT' ? 'CASH' : paymentname, cash, date])
          //#endregion

          if (paymenttype === 'SPLIT') {
            activity.push([detailid, paymentname, ecash, date])
          }

          mysql.InsertTable('cashier_activity', activity, (err, result) => {
            if (err) console.error('Error: ', err)
            console.log(`$Cashier Activity: ${result}`)
          })

          if (paymenttype != 'CASH') {
            let paymentdetails = [[detailid, paymenttype, referenceid, date]]

            mysql.InsertTable('epayment_details', paymentdetails, (err, result) => {
              if (err) console.error('Error: ', err)
              console.log(`$E-Payment Details: ${result}`)
            })
          }

          //#region Discount
          if (discountdetail.length != 0) {
            let discountJSON = JSON.parse(discountdetail)
            discountJSON.forEach((key, item) => {
              let sales_discount = [
                [detailid, key.discountid, JSON.stringify(key.customerinfo), key.amount],
              ]

              console.log(sales_discount)

              InsertSalesDiscount(sales_discount)
                .then((result) => {
                  console.log(`$Sales Discount: ${result}`)
                })
                .catch((error) => {
                  console.log(error)
                  return res.json({
                    msg: error,
                  })
                })
            })
          }
          //#endregion

          //#region Promo
          let currentdate = helper.GetCurrentDate()
          GetPromo(currentdate)
            .then((result) => {
              if (result.length != 0) {
                let condition = parseFloat(result[0].condition)
                let promoid = result[0].promoid
                let sales_promo = [[promoid, detailid]]

                if (total > condition) {
                  mysql.InsertTable('sales_promo', sales_promo, (err, result) => {
                    if (err) console.error('Error: ', err)

                    console.log(`$Sales Promo: ${result}`)
                  })
                }
              }
            })
            .catch((error) => {
              return res.json({
                msg: error,
              })
            })

          //#endregion

          res.json({
            msg: 'success',
          })
        })
      }
    })
  } catch (error) {
    console.error(error)
    res.json({
      msg: error,
    })
  }
})

router.post('/status/:transactionId', (req, res) => {
  try {
    let transactionId = req.params.transactionId
    let status =
      req.body.status == dictionary.GetValue(dictionary.RFND())
        ? dictionary.GetValue(dictionary.RFND())
        : dictionary.GetValue(dictionary.CND())
    let data = [status, transactionId]
    const reason = req.body.reason

    let sql_Update = `UPDATE sales_detail SET st_status = ? WHERE st_detail_id = ?`
    let sqlSelect = `SELECT st_description, st_branch FROM sales_detail WHERE st_detail_id = '${transactionId}'`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      let loglevel = dictionary.INF()
      let source = dictionary.SALES()
      let message = `${dictionary.GetValue(dictionary.UPDT())} -  [${data}]`
      let user = req.session.employeeid

      Logger(loglevel, source, message, user)
    })

    mysql.SelectResult(sqlSelect, (err, result) => {
      if (err) console.error('Error: ', err)
      const data = DataModeling(result, 'st_')
      const branch = data[0].branch
      const description = JSON.parse(data[0].description)

      description.forEach((row) => {
        const { id, name, price, quantity, stocks } = row
        const toAdd = quantity

        if (name.includes('Discount')) {
          console.log(name)
        } else {
          const selectProductInventory = `SELECT mp_productid FROM master_product WHERE mp_productid='${id}'`
          mysql.SelectResult(selectProductInventory, (err, result) => {
            if (err) console.error('Error: ', err)
            const data = DataModeling(result, 'mp_')
            const productid = data[0].productid
            const inventoryid = `${productid}${branch}`

            const record_query = helper.InsertStatement('history', 'h', [
              'branch',
              'quantity',
              'date',
              'productid',
              'inventoryid',
              'movementid',
              'type',
              'stocksafter',
            ])

            const selectInventory = `SELECT pi_quantity, pi_productid FROM product_inventory WHERE pi_inventoryid='${inventoryid}'`
            mysql.SelectResult(selectInventory, (err, result) => {
              if (err) console.error('Error: ', err)
              const data = DataModeling(result, 'pi_')
              data.forEach((row) => {
                const { quantity, productid } = row
                const currentquantity = quantity

                console.log(toAdd, currentquantity)
                const total = toAdd + currentquantity

                const history_date = [
                  [
                    branch,
                    toAdd,
                    helper.GetCurrentDatetime(),
                    productid,
                    inventoryid,
                    transactionId,
                    status,
                    total,
                  ],
                ]

                mysql.Insert(record_query, history_date, (err, result) => {
                  if (err) {
                    console.log(err)
                    res.status(400), res.json({ msg: err })
                  }
                })

                counter = +1

                Add(total, inventoryid)
              })
            })
          })
        }
      })
    })

    function Add(quantity, inventoryid, datalenght, counter) {
      let sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`
      let data = [quantity, inventoryid]
      mysql.UpdateMultiple(sql_add, data, (err, result) => {
        if (err) console.error('Error: ', err)
      })
    }

    let refund = [[transactionId, reason, req.session.employeeid, helper.GetCurrentDatetime()]]
    mysql.InsertTable('refund', refund, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }
      //console.log(result)
    })

    res.status(200),
      res.json({
        msg: 'success',
      })
  } catch (error) {
    console.log(error)
    res.json({
      msg: error,
    })
  }
})

router.post('/getdetailid', verifyJWT, (req, res) => {
  try {
    let posid = req.body.posid
    let sql = `select st_detail_id as detailid from sales_detail where st_pos_id='${posid}' order by st_detail_id desc limit 1`
    let receipt = `${posid}00000000`

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error('Error: ', err)

      // //console.log(result);

      if (result.length != 0) {
        res.json({
          msg: 'success',
          data: result[0].detailid,
        })
      } else {
        res.json({
          msg: 'success',
          data: receipt,
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/getdetails', (req, res) => {
  try {
    const detailid = req.body.detailid

    let sql = `SELECT st_detail_id AS ornumber,
    st_date AS ordate,
    st_description AS ordescription,
    st_payment_type as orpaymenttype,
    st_pos_id as posid,
    st_shift as shift,
    st_cashier as cashier,
    st_total as total,
    ed_type as epaymentname,
    ed_referenceid as referenceid,
    ca_paymenttype as paymentmethod,
    ca_amount as amount
    FROM sales_detail 
    left join epayment_details on st_detail_id = ed_detailid
    left join cashier_activity on ca_detailid = st_detail_id
    WHERE st_detail_id='${detailid}'`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      if (result.length != 0) {
        let data = []
        result.forEach((key, item) => {
          data.push({
            ornumber: key.ornumber,
            ordate: key.ordate,
            ordescription: key.ordescription,
            orpaymenttype: key.orpaymenttype,
            posid: key.posid,
            shift: key.shift,
            cashier: key.cashier,
            total: key.total,
            epaymentname: key.epaymentname == null ? '' : key.referenceid,
            referenceid: key.referenceid == null ? '' : key.referenceid,
            paymentmethod: key.paymentmethod == null ? '' : key.paymentmethod,
            amount: key.amount,
          })
        })

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
    res.json({
      msg: error,
      data: '',
    })
  }
})

router.post('/getdescription', (req, res) => {
  try {
    let { daterange, branch } = req.body
    let [startDate, endDate] = daterange.split(' - ')
    let activeDiscounts = []

    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)

    let sql_select = `
        SELECT st_description
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount)
      })
    })

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      // const tableData = {
      //   tableDetails: sortedProducts,
      //   totalPrice: overallTotalPrice
      // }

      const data = {
        sortedProducts: SortProducts(result, activeDiscounts),
        graphData: GraphData(result, activeDiscounts),
      }
      // console.log("Data:", data);
      res.json({
        msg: 'success',
        data: data,
      })
    })
  } catch (error) {
    res.json({
      msg: 'error',
      error: error,
    })
  }
})

router.post('/top-sellers-table', (req, res) => {
  try {
    let { daterange, branch } = req.body
    let [startDate, endDate] = daterange.split(' - ')
    let activeDiscounts = []

    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)

    let sql_select = `SELECT st_description FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`
    }

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount)
      })
    })

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      let sortedProducts = SortProducts(result, activeDiscounts)
      let promises = []

      sortedProducts.sortedProducts.forEach((row) => {
        const { productName, quantity, price, id } = row
        let select_product
        if (id) {
          select_product = `SELECT mp_productid as id, mc_categoryname as category FROM master_product
              INNER JOIN master_category ON mc_categorycode = mp_category WHERE mp_productid = '${id}'`
        } else {
          select_product = `SELECT mp_productid as id, mc_categoryname as category FROM master_product
              INNER JOIN master_category ON mc_categorycode = mp_category WHERE mp_description = '${productName}'`
        }

        let promise = new Promise((resolve, reject) => {
          mysql.SelectResult(select_product, (err, result) => {
            if (err) {
              console.error('Error: ', err)
              reject(err)
            } else {
              if (result.length != 0) {
                const { id, category } = result[0]
                row.productId = id
                row.category = category
              }
              resolve()
            }
          })
        })

        promises.push(promise)
      })

      Promise.all(promises)
        .then(() => {
          res.json({
            msg: 'success',
            data: sortedProducts,
          })
        })
        .catch((err) => {
          console.error('Error: ', err)
          res.json({
            msg: 'error',
            error: err,
          })
        })
    })
  } catch (error) {
    res.json({
      msg: 'error',
      error: error,
    })
  }
})

router.post('/gettotalsold', (req, res) => {
  try {
    let { daterange, branch } = req.body
    let [startDate, endDate] = daterange.split(' - ')

    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)

    let sql_select = `
        SELECT st_date as date, st_total as total
        FROM sales_detail
        WHERE st_date BETWEEN'${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`
    }

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }
      res.json({
        msg: 'success',
        data: result,
      })
      if (result == '') {
        console.log('NO DATA!')
      } else {
        // // //console.log(result);
        // console.log(sql_select);
      }
    })
  } catch (error) {
    res.json({
      msg: 'error',
      error: error,
    })
  }
})

router.post('/get-sales-details', verifyJWT, (req, res) => {
  try {
    let details = {}

    let { daterange, branch } = req.body
    let [startDate, endDate] = daterange.split(' - ')
    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)
    console.log('Branch: ' + branch)
    let sql_select = `SELECT st_description as description, st_detail_id as detailid, st_total as total, st_status as status
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59'`
    console.log('startDate: ', startDate, 'endDate: ', endDate)

    if (branch) {
      sql_select += ` AND st_branch = '${branch}'`
    }

    // console.log('Query:', sql_select)
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      let NetSales = 0
      let GrossProfit = 0
      let GrossSales = 0
      let Discounts = 0
      let Refunds = 0
      let Cancelled = 0

      if (result.length != 0) {
        let getRefund = `SELECT st_detail_id as id, st_total as total FROM sales_detail WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'REFUNDED'`
        if (branch) {
          getRefund += ` AND st_branch = '${branch}'`
        }
        mysql.SelectResult(getRefund, (err, result) => {
          if (err) {
            console.error('Error: ', err)
            res.json({
              msg: 'error',
              error: err,
            })
          }

          if (result.length != 0) {
            const refundData = DataModeling(result, 'st_')
            refundData.forEach((row) => {
              const { id, total } = row
              console.log('refunded transaction id:', id, 'total:', total)
              Refunds += total * -1
            })
          }
        })

        let getCancelled = `SELECT st_detail_id as id, st_total as total FROM sales_detail WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'CANCELLED'`
        if (branch) {
          getCancelled += ` AND st_branch = '${branch}'`
        }

        mysql.SelectResult(getCancelled, (err, result) => {
          if (err) {
            console.error('Error: ', err)
            res.json({
              msg: 'error',
              error: err,
            })
          }

          if (result.length != 0) {
            const cancelData = DataModeling(result, 'st_')
            cancelData.forEach((row) => {
              const { id, total } = row
              console.log('cancelled transaction id:', id, 'total:', total)
              Cancelled += total * -1
            })
          }
        })

        const executeQuery = (query) => {
          return new Promise((resolve, reject) => {
            mysql.SelectResult(query, (err, result) => {
              if (err) {
                reject(err)
              } else {
                resolve(result)
              }
            })
          })
        }

        const processItems = async () => {
          for (let rowData of result) {
            // console.log("Detail ID:", detailid, "Total:", total);
            let descriptionJson = JSON.parse(rowData.description)

            if (rowData.status == 'SOLD') {
            }

            for (let item of descriptionJson) {
              let productname = item.name
              let totalPrice = parseFloat(item.price) * parseFloat(item.quantity)

              let select_product = `SELECT mp_cost as cost FROM master_product WHERE mp_description = '${productname}'`

              try {
                const queryResult = await executeQuery(select_product)
                if (queryResult.length != 0 && queryResult[0].cost != null) {
                  let cost = parseFloat(queryResult[0].cost).toFixed(2)
                  let totalCost = cost * parseFloat(item.quantity).toFixed(2)
                  let difference =
                    parseFloat(totalPrice).toFixed(2) - parseFloat(totalCost).toFixed(2)
                  // console.log("Name:", item.name, "totalPrice:", totalPrice, "Total Cost:", totalCost, "Difference:", difference)
                  GrossSales += totalPrice
                  if (rowData.status == 'SOLD') {
                    GrossProfit += difference
                  }
                } else {
                  // console.log("Name:", productname, "totalPrice:", totalPrice)
                  Discounts += totalPrice
                  GrossProfit += totalPrice
                }
              } catch (err) {
                console.error(err)
              }
            }
          }
        }

        processItems()
          .then(() => {
            NetSales = GrossSales + (Discounts + Refunds + Cancelled)
            let Profit = GrossProfit
            details = [
              {
                GrossSales: GrossSales,
                Discounts: Discounts,
                NetSales: NetSales,
                Refunds: Refunds,
                Cancelled: Cancelled,
                GrossProfit: Profit,
                Date: formattedStartDate + ' - ' + formattedEndDate,
              },
            ]
            res.json({
              msg: 'success',
              data: details,
            })
          })
          .catch((err) => {
            console.error(err)
            res.status(500).json({ error: 'An error occurred.' })
          })
      } else {
        let Refunds
        let getRefund = `SELECT st_detail_id as id, st_total as total FROM sales_detail WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'REFUNDED'`
        if (branch) {
          getRefund += ` AND st_branch = '${branch}'`
        }
        mysql.SelectResult(getRefund, (err, result) => {
          if (err) {
            console.error('Error: ', err)
            res.json({
              msg: 'error',
              error: err,
            })
          }
          const getRefund = async () => {
            if (result.length != 0) {
              const refundData = DataModeling(result, 'st_')
              refundData.forEach((row) => {
                const { id, total } = row
                console.log('refunded transaction id:', id, 'total:', total)
                Refunds += total * -1
              })
            } else {
              Refunds = 0
            }
          }
          getRefund()
            .then(() => {
              details = [
                {
                  GrossSales: 0,
                  Discounts: 0,
                  NetSales: 0,
                  Refunds: Refunds,
                  Cancelled: Cancelled,
                  GrossProfit: 0,
                  Date: formattedStartDate + ' - ' + formattedEndDate,
                },
              ]
              res.json({
                msg: 'success',
                data: details,
              })
            })
            .catch((err) => {
              console.error(err)
              res.status(500).json({ error: 'An error occurred.' })
            })
        })
      }
    })
  } catch (error) {
    res.json({
      msg: 'error',
      error: error,
    })
  }
})

router.post('/topsellers', (req, res) => {
  try {
    let { startDate, endDate } = req.body
    let overallTotalPrice = 0
    let mergedData = {}
    let activeDiscounts = []

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`

    if (startDate != '' && endDate != '') {
      mysql.SelectResult(getDiscount, (err, result) => {
        if (err) {
          console.error('Error: ', err)
          res.json({
            msg: 'error',
            error: err,
          })
          return
        }

        result.forEach((item) => {
          activeDiscounts.push(item.discount)
        })
      })

      let sql_select = `SELECT st_description as description FROM sales_detail
        WHERE st_date BETWEEN '${startDate} 00:00' AND '${endDate} 23:59' AND st_status = 'SOLD'`

      mysql.SelectResult(sql_select, (err, result) => {
        if (err) {
          console.error('Error: ', err)
          res.json({
            msg: 'error',
            error: err,
          })
          return
        }

        result.forEach((item) => {
          let description = JSON.parse(item.description)

          description.forEach((product) => {
            const { name, price, quantity } = product

            let shouldIncludeProduct = true
            activeDiscounts.forEach((discount) => {
              if (name.toLowerCase().includes(discount.toLowerCase())) {
                shouldIncludeProduct = false
              }
            })

            if (shouldIncludeProduct) {
              if (mergedData[name]) {
                mergedData[name].quantity += quantity
                mergedData[name].price += price * quantity
              } else {
                mergedData[name] = { quantity, price: price * quantity }
              }
              overallTotalPrice += price * quantity
            }
          })
        })
        const sortedProducts = Object.entries(mergedData)
          .map(([productName, productDetails]) => ({
            productName,
            ...productDetails,
          }))
          .sort((a, b) => b.quantity - a.quantity)
        const topItems = sortedProducts.slice(0, 5)

        res.json({
          msg: 'success',
          data: topItems,
        })
        if (result == '') {
          console.log('NO DATA!')
        } else {
          // //console.log(result);
          console.log(sql_select)
        }
      })
    } else {
      res.json({
        msg: 'Empty Payload',
      })
    }
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.get('/yearly', (req, res) => {
  try {
    let sql = `SELECT 
                  MONTH(st_date) as month, 
                  YEAR(st_date) as year, 
                  MAX(mb_branchname) as branch, 
                  SUM(CAST(st_total AS DECIMAL(10, 2))) AS total
              FROM 
                  sales_detail
              INNER JOIN 
                  master_branch ON mb_branchid = st_branch
              WHERE 
                  st_status = 'SOLD'
              GROUP BY 
                  YEAR(st_date), MONTH(st_date), st_branch, st_description
              ORDER BY 
                  YEAR(st_date), MONTH(st_date), st_branch, st_description;`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      // console.log(helper.GetCurrentDatetime());

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

router.post('/by-branch/daily-sales', (req, res) => {
  try {
    let { date, branch } = req.body
    let total = 0
    let totalSold = 0
    let sql = `SELECT 
              mb_branchname as branch,
              SUM(CAST(st_total AS DECIMAL(10, 2))) AS totalSales
            FROM sales_detail
            INNER JOIN master_branch ON mb_branchid = st_branch
            WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_branch = '${branch}' AND st_status = 'SOLD'
            GROUP BY mb_branchname;`

    let sql_description = `SELECT st_description as description FROM sales_detail WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_branch = '${branch}' AND st_status = 'SOLD'`

    mysql.SelectResult(sql_description, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }
      // console.log("1st query result:", result);

      result.forEach((row) => {
        const description = JSON.parse(row.description)
        description.forEach((item) => {
          const { name, price, quantity } = item

          total += price * quantity
          totalSold += quantity
        })
      })

      if (result.length != 0) {
        mysql.SelectResult(sql, (err, result) => {
          if (err) {
            console.log(err)
            return res.json({
              msg: err,
            })
          }
          // console.log("2nd query result:", result);

          const branch = result[0].branch
          const totalSales = result[0].totalSales

          const data = [
            {
              totalSales: totalSales,
              totalSold: totalSold,
            },
          ]

          res.json({
            msg: 'success',
            data: data,
          })
        })
      } else {
        const data = [
          {
            totalSales: 0,
            totalSold: 0,
          },
        ]

        res.json({
          msg: 'success',
          data: data,
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/total-daily-purchase', (req, res) => {
  try {
    let { date, branch } = req.body
    let activeDiscounts = []

    let sql = `SELECT st_description as purchased
            FROM sales_detail
            WHERE st_date BETWEEN '${date} 00:00' AND '${date} 23:59' AND st_branch = '${branch}' AND st_status = 'SOLD';`

    let getDiscount = `SELECT dd_name as discount FROM discounts_details WHERE dd_status = 'ACTIVE'`

    mysql.SelectResult(getDiscount, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      result.forEach((item) => {
        activeDiscounts.push(item.discount)
      })
    })

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }
      let totalPurchased = 0

      result.forEach((item) => {
        let purchased = JSON.parse(item.purchased)
        // console.log("Details: ", purchased)
        purchased.forEach((res) => {
          let quantity = res.quantity
          let product = res.name

          let shouldIncludeProduct = true
          activeDiscounts.forEach((discount) => {
            if (product.toLowerCase().includes(discount.toLowerCase())) {
              shouldIncludeProduct = false
            }
          })

          if (shouldIncludeProduct) {
            totalPurchased += quantity
          }
        })
      })

      let total = [
        {
          date: date,
          branch: branch,
          totalPurchased: totalPurchased,
        },
      ]

      res.json({
        msg: 'success',
        data: total,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/payment-sales', (req, res) => {
  try {
    let { dateRange, branch } = req.body
    let [startDate, endDate] = dateRange.split(' - ')
    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)

    let sql = `SELECT ca_detailid as id, st_branch as branch, ca_paymenttype as paymentType, ca_amount as amount, ca_date as date FROM cashier_activity 
                INNER JOIN sales_detail ON st_detail_id = ca_detailid
                WHERE ca_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD'`

    if (branch) {
      sql += ` AND st_branch = ${branch}`
    }
    // console.log(sql);
    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }

      if (result.length == 0) {
        res.json({
          msg: 'No Data',
        })
      } else {
        let groupedData = {}
        let overallTotals = {}

        let availablePaymentTypes = new Set()
        result.forEach((item) => {
          availablePaymentTypes.add(item.paymentType)
        })

        //console.log(result)
        result.forEach((item) => {
          let dateKey = item.date.split(' ')[0]
          if (!groupedData[dateKey]) {
            groupedData[dateKey] = {}
          }
          if (!groupedData[dateKey][item.paymentType]) {
            groupedData[dateKey][item.paymentType] = 0
          }
          groupedData[dateKey][item.paymentType] += item.amount

          if (!overallTotals[item.paymentType]) {
            overallTotals[item.paymentType] = 0
          }
          overallTotals[item.paymentType] += item.amount
        })
        console.log(overallTotals)

        availablePaymentTypes.forEach((paymentType) => {
          let currentDate = new Date(formattedStartDate)
          const endDateObj = new Date(formattedEndDate)
          while (currentDate <= endDateObj) {
            const currentDateKey = currentDate.toISOString().split('T')[0]
            if (!groupedData[currentDateKey]) {
              groupedData[currentDateKey] = {}
            }
            if (!groupedData[currentDateKey][paymentType]) {
              groupedData[currentDateKey][paymentType] = 0
            }
            currentDate.setDate(currentDate.getDate() + 1)
          }
        })

        let sortedGroupedData = {}
        Object.keys(groupedData)
          .sort()
          .forEach((dateKey) => {
            sortedGroupedData[dateKey] = groupedData[dateKey]
          })

        res.json({
          msg: 'success',
          data: sortedGroupedData,
          overallTotals: overallTotals,
        })
      }
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/refund', (req, res) => {
  try {
    const { detailid, reason, cashier } = req.body
    let refunddate = helper.GetCurrentDatetime()
    let status = dictionary.GetValue(dictionary.RFND())
    let sql_Update = `UPDATE sales_detail SET st_status = ? WHERE st_detail_id = ?`

    let sql_salesdetails = 'select * from sales_detail where st_detail_id=?'
    let cmd_salesdetails = helper.SelectStatement(sql_salesdetails, [detailid])

    mysql.Select(cmd_salesdetails, 'SalesDetail', (err, salesdetailresult) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }

      if (salesdetailresult.length != 0) {
        const branch = salesdetailresult[0].branch
        const description = JSON.parse(salesdetailresult[0].description)

        description.forEach((items) => {
          const { id, name, price, quantity, stocks } = items
          const inventoryId = `${id}${branch}`
          const newQuantity = quantity

          if (name.includes('Discount')) {
          } else {
            const recordHistory = helper.InsertStatement('history', 'h', [
              'branch',
              'quantity',
              'date',
              'productid',
              'inventoryid',
              'movementid',
              'type',
              'stocksafter',
            ])

            const selectInventory = `SELECT pi_quantity, pi_productid FROM product_inventory WHERE pi_inventoryid='${inventoryId}'`
            mysql.SelectResult(selectInventory, (err, result) => {
              if (err) console.error('Error: ', err)
              const data = DataModeling(result, 'pi_')
              data.forEach((row) => {
                const { quantity, productid } = row
                const oldQuantity = quantity

                const total = newQuantity + oldQuantity

                const historyData = [
                  [
                    branch,
                    newQuantity,
                    helper.GetCurrentDatetime(),
                    productid,
                    inventoryId,
                    detailid,
                    'REFUND',
                    total,
                  ],
                ]

                mysql.Insert(recordHistory, historyData, (err, result) => {
                  if (err) {
                    console.log(err)
                    res.status(400), res.json({ msg: err })
                  }
                })

                Add(total, inventoryId)
              })
            })
          }
        })

        function Add(quantity, inventoryId) {
          let sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`
          let data = [quantity, inventoryId]
          mysql.UpdateMultiple(sql_add, data, (err, result) => {
            if (err) console.error('Error: ', err)
          })
        }

        let sql_check = 'select * from refund where r_detailid=?'
        let cmd_check = helper.SelectStatement(sql_check, [detailid])
        mysql.Select(cmd_check, 'Refund', (err, refundresult) => {
          if (err) {
            console.log(err)
            return res.json({
              msg: err,
            })
          }

          let sql_employee = 'select * from master_employees where me_fullname = ?'
          let cmd_employee = helper.SelectStatement(sql_employee, [cashier])

          console.log(cmd_employee)
          let status_update = [status, detailid]

          mysql.UpdateMultiple(sql_Update, status_update, (err, result) => {
            if (err) console.error('Error: ', err)
          })

          mysql.Select(cmd_employee, 'MasterEmployees', (err, employeeresult) => {
            if (err) {
              console.log(err)
              return res.json({
                msg: err,
              })
            }

            let employeeid = employeeresult[0].employeeid

            if (refundresult.length != 0) {
              return res.json({
                msg: 'refunded',
              })
            } else {
              //#region Insert Refund Details
              let refund = [[detailid, reason, employeeid, refunddate]]
              mysql.InsertTable('refund', refund, (err, result) => {
                if (err) {
                  console.log(err)
                  return res.json({
                    msg: err,
                  })
                }

                //console.log(result)

                res.json({
                  msg: 'success',
                })
                //#endregion
              })
            }
          })
        })
      } else {
        res.json({
          msg: 'ornotexist',
        })
      }
    })
  } catch (error) {
    console.log(error)
    res.json({
      msg: error,
    })
  }
})

router.post('/staff-sales', (req, res) => {
  try {
    let { daterange, cashier } = req.body
    let [startDate, endDate] = daterange.split(' - ')
    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)
    console.log('startDate: ', formattedStartDate, 'endDate: ', formattedEndDate)
    let sql_select = `
      SELECT st_detail_id as detailid, st_date as date, st_pos_id as posid, st_shift as shift, st_payment_type as paymenttype,
        st_description as description, st_total as total, st_cashier as cashier, mb_branchname as branch, me_employeeid as employeeid
      FROM sales_detail
      INNER JOIN master_branch ON mb_branchid = st_branch
      INNER JOIN master_employees ON me_fullname = st_cashier
      WHERE st_date BETWEEN '${formattedStartDate} 00:00:00' AND '${formattedEndDate} 23:59:59' AND st_cashier = '${cashier}' AND st_status = 'SOLD'`

    // console.log(sql_select)
    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.log(err)
        return res.json({
          msg: err,
        })
      }

      let data = []

      if (result.length != 0) {
        data = ProcessedStaffSales(result)
        data = MergeObjects(data)

        let promises = []

        data.soldItems.forEach((row) => {
          const { name, quantity, totalPrice } = row
          // console.log(name, quantity, totalPrice)
          let select_product = `SELECT mp_productid as id, mc_categoryname as category FROM master_product
              INNER JOIN master_category ON mc_categorycode = mp_category WHERE mp_description = '${name}'`

          let promise = new Promise((resolve, reject) => {
            mysql.SelectResult(select_product, (err, result) => {
              if (err) {
                console.error('Error: ', err)
                reject(err)
              } else {
                if (result.length != 0) {
                  const { id, category } = result[0]
                  row.productId = id
                  row.category = category
                }
                resolve()
              }
            })
          })

          promises.push(promise)
        })

        Promise.all(promises)
          .then(() => {
            // console.log(data);
            res.json({
              msg: 'success',
              data: data,
            })
          })
          .catch((err) => {
            console.error('Error: ', err)
            res.json({
              msg: 'error',
              error: err,
            })
          })
      } else {
        res.json({
          msg: 'success',
          data: data,
        })
      }
    })
  } catch (error) {
    res.json({ msg: error })
  }
})

router.post('/staff-sales/graph', (req, res) => {
  try {
    let { daterange, cashier } = req.body
    let [startDate, endDate] = daterange.split(' - ')
    let formattedStartDate = helper.ConvertDate(startDate)
    let formattedEndDate = helper.ConvertDate(endDate)

    let sql_select = `
        SELECT st_date as date, st_total as total
        FROM sales_detail
        WHERE st_date BETWEEN '${formattedStartDate} 00:00' AND '${formattedEndDate} 23:59' AND st_status = 'SOLD' AND st_cashier = '${cashier}'`

    mysql.SelectResult(sql_select, (err, result) => {
      if (err) {
        console.error('Error: ', err)
        res.json({
          msg: 'error',
          error: err,
        })
        return
      }

      res.json({
        msg: 'success',
        data: result,
      })
    })
  } catch (error) {
    res.json({
      msg: 'error',
      error: error,
    })
  }
})

router.post('/getreceipts', (req, res) => {
  try {
    const { datefrom, dateto, posid } = req.body
    let sql = `select 
    st_detail_id,
    st_date,
    st_pos_id,
    st_shift,
    st_payment_type,
    st_description,
    st_total,
    st_cashier,
    st_status,
    ca_paymenttype as st_tenderpaymenttype,
    ca_amount as st_tenderamount,
    case when isnull(ed_type) then 'N/A' else ed_type end as st_epaymenttype,
    case when isnull(ed_referenceid) then 'N/A' else ed_referenceid end  as st_referenceid
    from sales_detail
    inner join cashier_activity on ca_detailid = st_detail_id
    left join epayment_details on ed_detailid = st_detail_id
    where st_date between ? and ?
    and st_pos_id = ?`
    let cmd = helper.SelectStatement(sql, [`${datefrom} 00:00:00`, `${dateto} 23:59:59`, posid])

    console.log(cmd)

    mysql.SelectResult(cmd, (error, result) => {
      if (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
      }

      if (result.length != 0) {
        let data = DataModeling(result, 'st_')

        console.log(data)

        res.status(200).json({
          msg: 'success',
          data: data,
        })
      } else {
        res.status(200).json({
          msg: 'success',
          data: result,
        })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: error })
  }
})

router.post('/splitpayment', (req, res) => {
  try {
    const {
      detailid,
      date,
      posid,
      shift,
      items,
      staff,
      firstpayment,
      secondpayment,
      firstpaymenttype,
      secondpaymenttype,
      branchid,
      firstpatmentreference,
      secondpaymentreference,
      discountdetails,
      total,
    } = req.body
    let status = dictionary.GetValue(dictionary.SLD())
    let sales_detail = []

    console.log('hit')

    async function ProcessData(params) {
      let isExist = await Check('select * from sales_detail where st_detail_id = ?', [detailid])
      console.log(isExist)

      console.log(req.body)

      if (isExist) {
        return res.status(400).json({ msg: `order id ${detailid} already exist` })
      } else {
        Query(
          `INSERT INTO sales_detail
              (st_detail_id,
              st_date,
              st_pos_id,
              st_shift,
              st_payment_type,
              st_description,
              st_total,
              st_cashier,
              st_branch,
              st_status)
              VALUES
              (?,?,?,?,?,?,?,?,?,?)`,
          [detailid, date, posid, shift, 'SPLIT', items, total, staff, branchid, status]
        )

        let detail_description = JSON.parse(items)
        for (const i in detail_description) {
          const { id, price, quantity, stocks } = detail_description[i]
          //#region Insert Sales Items
          Query(
            `INSERT INTO sales_item
              (si_detail_id,
              si_date,
              si_item,
              si_price,
              si_quantity,
              si_total)
              VALUES
              (?,?,?,?,?,?)`,
            [detailid, date, id, price, quantity, stocks]
          )
          //#endregion
        }

        //#region Sales Inventory History - Inventory Deduction
        InsertSalesInventoryHistory(detailid, date, branchid, detail_description, staff, detailid)
          .then((result) => {
            console.log(`$Inventory Sales History: ${result}`)
          })
          .catch((error) => {
            console.error('Inventory Error: ', error)
            return res.json({
              msg: 'error',
            })
          })
        //#endregion

        //#region Cashier Activity
        Query(
          `INSERT INTO cashier_activity(
          ca_detailid,
          ca_paymenttype,
          ca_amount,
          ca_date
        ) VALUES (?,?,?,?)`,
          [detailid, firstpaymenttype, firstpayment, date]
        )

        Query(
          `INSERT INTO cashier_activity(
            ca_detailid,
            ca_paymenttype,
            ca_amount,
            ca_date
          ) VALUES (?,?,?,?)`,
          [detailid, secondpaymenttype, secondpayment, date]
        )
        //#endregion

        //#region Epayment Details
        Query(
          `
          INSERT INTO epayment_details(
          ed_detailid,
          ed_type,
          ed_referenceid,
          ed_date
        ) VALUES (?,?,?,?)`,
          [detailid, firstpaymenttype, firstpatmentreference, date]
        )
        Query(
          `
            INSERT INTO epayment_details(
            ed_detailid,
            ed_type,
            ed_referenceid,
            ed_date
          ) VALUES (?,?,?,?)`,
          [detailid, secondpaymenttype, secondpaymentreference, date]
        )
        //#endregion

        //#region Discount Details
        if (discountdetails.length != 0) {
          let discountJSON = JSON.parse(discountdetails)
          discountJSON.forEach((key, item) => {
            let sales_discount = [
              [detailid, key.discountid, JSON.stringify(key.customerinfo), key.amount],
            ]

            console.log(sales_discount)

            InsertSalesDiscount(sales_discount)
              .then((result) => {
                console.log(`$Sales Discount: ${result}`)
              })
              .catch((error) => {
                console.log(error)
              })
          })
        }
        //#endregion

        //#region Promo Details
        let currentdate = helper.GetCurrentDate()
        GetPromo(currentdate)
          .then((result) => {
            if (result.length != 0) {
              let condition = parseFloat(result[0].condition)
              let promoid = result[0].promoid
              let sales_promo = [[promoid, detailid]]

              if (total > condition) {
                mysql.InsertTable('sales_promo', sales_promo, (err, result) => {
                  if (err) console.error('Error: ', err)

                  console.log(`$Sales Promo: ${result}`)
                })
              }
            }
          })
          .catch((error) => {
            return res.json({
              msg: error,
            })
          })
        //#endregion

        res.status(200).json({ msg: 'success' })
      }
    }

    ProcessData()
  } catch (error) {
    res.status(500).json({ msg: error })
  }
})

router.post('/summary-sales', (req, res) => {
  try {
    const { type, branch, startdate, enddate } = req.body

    let sql = `
        SELECT 
          CASE 
              WHEN SUM(si_quantity * si_price) < 0 THEN COALESCE(dd_description, mp_description) 
              ELSE mp_description 
          END AS item,
          CASE 
              WHEN SUM(si_quantity * si_price) < 0 THEN 'Discounts & Promo' 
              ELSE mc_categoryname 
          END AS category,
          SUM(si_quantity) AS quantity,
          si_price AS price,
          SUM(si_quantity * si_price) AS total
      FROM sales_detail
      INNER JOIN sales_item ON st_detail_id = si_detail_id
      INNER JOIN master_product ON si_item = mp_productid
      INNER JOIN master_category ON mc_categorycode = mp_category
      LEFT JOIN discounts_details ON dd_discountid = si_item
      WHERE st_date BETWEEN ? AND ? 
     `

    if (type) {
      sql += ` st_status = '${type}' and`
    }

    if (branch) {
      sql += ` st_branch = '${branch}' and`
    }

    sql = sql.slice(0, -3)
    sql += ` GROUP BY mp_description, dd_description, mc_categoryname, si_price
      ORDER BY si_price DESC`

    let cmd = helper.SelectStatement(sql, [`${startdate} 00:00:00`, `${enddate} 23:59:59`])

    console.log(cmd)

    mysql.SelectResult(cmd, (err, result) => {
      if (err) {
        res.status(500).json({ msg: err })
      }

      res.status(200).send({
        msg: 'success',
        data: {
          data: result,
          type: type,
          branch: branch,
          date: `${startdate} - ${enddate}`,
        },
      })
    })
  } catch (error) {
    res.status(500).json({ msg: error })
  }
})

//#region Functions
function GetPromo(currentdate) {
  return new Promise((resolve, reject) => {
    let status = dictionary.GetValue(dictionary.ACT())
    let sql = `select * from promo_details where '${currentdate}' between pd_startdate and pd_enddate and pd_status='${status}'`

    mysql.Select(sql, 'PromoDetails', (err, result) => {
      if (err) reject(err)

      // // //console.log(result);

      resolve(result)
    })
  })
}

function InsertSalesDiscount(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable('sales_discount', data, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      }

      resolve(result)
    })
  })
}

function InsertSalesInventoryHistory(detailid, date, branch, data, cashier, salesId) {
  return new Promise((resolve, reject) => {
    console.log('Data Details:', data)
    data.forEach((key, item) => {
      console.log(key.id)
      const itemid = key.id
      const itemname = key.name
      const quantity = parseFloat(key.quantity)
      const stocks = parseInt(key.stocks)
      const stocksafter = stocks - quantity
      const sql_product = `select mp_productid as productid from master_product where mp_productid=${itemid}`

      if (itemname.includes('Discount')) {
      } else if (itemname.includes('Service')) {
      } else if (itemname.includes('Package')) {
        let select_package = `select * from  package where p_name='${itemname}'`
        mysql.Selects(select_package, (err, result) => {
          if (err) reject(err)
          let package_data = DataModeling(result, 'p_')
          let details = JSON.parse(package_data[0].details)

          details.forEach((detail) => {
            console.log(detail.id)
            let sql_product_package = `select mp_productid as productid from master_product where mp_productid=${detail.id}`
            mysql.SelectResult(sql_product_package, (err, result) => {
              if (err) reject(err)

              // //console.log(result);

              let productid = result[0].productid

              let packagedetails = [[detailid, date, productid, branch, detail.quantity * quantity]]
              let inventoryid = `${productid}${branch}`
              let inventory_history = [
                [
                  inventoryid,
                  detail.quantity * quantity,
                  dictionary.GetValue(dictionary.SLD()),
                  date,
                  cashier,
                ],
              ]

              // console.log(packagedetails);

              mysql.InsertTable('sales_inventory_history', packagedetails, (err, result) => {
                if (err) reject(err)

                // //console.log(result);

                let check_product_inventory = `select pi_quantity as quantity from product_inventory where pi_inventoryid='${inventoryid}'`
                mysql.SelectResult(check_product_inventory, (err, result) => {
                  if (err) reject(err)

                  // //console.log(result);

                  let currentquantity = parseFloat(result[0].quantity)
                  let deductionquantity = parseFloat(detail.quantity * quantity)
                  let difference = currentquantity - deductionquantity

                  let update_product_inventory =
                    'update product_inventory set pi_quantity = ? where pi_inventoryid = ?'
                  let product_inventory = [difference, inventoryid]

                  Notification(inventoryid, difference, branch)
                    .then((result) => {
                      // console.log("Test: ", result);
                    })
                    .catch((error) => {
                      // console.log(error);
                    })

                  UpdateProductInventory(update_product_inventory, product_inventory)
                    .then((result) => {
                      // //console.log(result);

                      mysql.InsertTable('inventory_history', inventory_history, (err, result) => {
                        if (err) console.log('Error: ', err)

                        // //console.log(result);
                      })
                    })
                    .catch((error) => {
                      reject(error)
                    })
                })
              })
            })
          })
        })
      } else if (itemname.includes('(Product)')) {
        let productname = itemname.replace(' (Product)', '')
        let quantity = parseFloat(helper.getQuantity(productname))
        let item = productname.replace(`${quantity}x `, '')

        let sql = `select mp_productid as productid from master_product where mp_description='${item}'`
        // console.log(sql);
        mysql.SelectResult(sql, (err, result) => {
          if (err) reject(err)

          // //console.log(result);
          let productid = result[0].productid

          let details = [[detailid, date, productid, branch, quantity]]
          let inventoryid = `${productid}${branch}`
          let inventory_history = [
            [inventoryid, quantity, dictionary.GetValue(dictionary.SLD()), date, cashier],
          ]

          mysql.InsertTable('sales_inventory_history', details, (err, result) => {
            if (err) reject(err)

            // //console.log(result);

            let check_product_inventory = `select pi_quantity as quantity from product_inventory where pi_inventoryid='${inventoryid}'`
            mysql.SelectResult(check_product_inventory, (err, result) => {
              if (err) reject(err)

              // //console.log(result);

              let currentquantity = parseFloat(result[0].quantity)
              let deductionquantity = parseFloat(quantity)
              let difference = currentquantity - deductionquantity

              let update_product_inventory =
                'update product_inventory set pi_quantity = ? where pi_inventoryid = ?'
              let product_inventory = [difference, inventoryid]

              Notification(inventoryid, difference, branch)
                .then((result) => {
                  // console.log("Test: ", result);
                })
                .catch((error) => {
                  // console.log(error);
                })

              UpdateProductInventory(update_product_inventory, product_inventory)
                .then((result) => {
                  // //console.log(result);

                  mysql.InsertTable('inventory_history', inventory_history, (err, result) => {
                    if (err) console.log('Error: ', err)

                    // //console.log(result);
                  })
                })
                .catch((error) => {
                  reject(error)
                })
            })
          })
        })
      } else {
        mysql.SelectResult(sql_product, (err, result) => {
          if (err) reject(err)
          // //console.log(result);
          const productid = result[0].productid
          const inventoryid = `${productid}${branch}`
          const check_product_inventory = `select pi_quantity as quantity from product_inventory where pi_inventoryid='${inventoryid}'`
          const record_query = helper.InsertStatement('history', 'h', [
            'branch',
            'quantity',
            'date',
            'productid',
            'inventoryid',
            'movementid',
            'type',
            'stocksafter',
          ])
          const history_date = [
            [
              branch,
              quantity,
              helper.GetCurrentDatetime(),
              productid,
              inventoryid,
              salesId,
              'SALES',
              stocksafter,
            ],
          ]

          mysql.Insert(record_query, history_date, (err, result) => {
            if (err) {
              console.log(err)
              res.status(400), res.json({ msg: err })
            }
          })

          mysql.SelectResult(check_product_inventory, (err, result) => {
            if (err) reject(err)
            const currentquantity = parseFloat(result[0].quantity)
            const deductionquantity = parseFloat(quantity)
            const difference = currentquantity - deductionquantity

            const update_product_inventory =
              'update product_inventory set pi_quantity = ? where pi_inventoryid = ?'
            const product_inventory = [difference, inventoryid]

            Notification(inventoryid, difference, branch)
              .then((result) => {
                // console.log("Test: ", result);
              })
              .catch((error) => {
                reject(error)
              })

            UpdateProductInventory(update_product_inventory, product_inventory)
              .then((result) => {
                // //console.log(result);
              })
              .catch((error) => {
                reject(error)
              })
          })
        })
      }
    })

    resolve('success')
  })
}

router.post('/test', (req, res) => {
  try {
    let { branchid, difference, inventoryid } = req.body
    console.log('initial log: ', branchid, difference, inventoryid)

    Notification(inventoryid, difference, branchid)
      .then((result) => {
        console.log('Test: ', result)
      })
      .catch((error) => {
        console.log(error)
      })

    res.json({
      msg: 'success',
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/sendnotification', (req, res) => {
  try {
    let { branchid } = req.body
    SendEmailNotification(branchid)
    res.status(200).send('success')
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

function UpdateProductInventory(sql, data) {
  return new Promise((resolve, reject) => {
    mysql.UpdateMultiple(sql, data, (err, result) => {
      if (err) reject(err)

      // //console.log(result);
      resolve(result)
    })
  })
}

function Notification(inventoryid, difference, branch) {
  return new Promise((resolve, reject) => {
    if (difference <= 15) {
      let check_notification = `SELECT 
          n_id as id, n_userid as userid, n_inventoryid as inventoryid, n_branchid as branchid, 
          n_quantity as quantity, n_message as message, n_status as status, n_checker as checker
        FROM notification WHERE n_inventoryid = '${inventoryid}' AND n_branchid = '${branch}'`

      mysql.SelectResult(check_notification, (err, result) => {
        if (err) {
          reject(err)
        }
        // console.log("initial phase[existing]: ", result);

        if (result.length != 0) {
          let existing = []
          let counter = 0
          result.forEach((item) => {
            counter += 1
            let id = item.id
            let checker = item.checker

            if (checker == 1) {
              // reject(id);
              // console.log("existing: ", id, "status: ", checker);
              existing.push(id)
              // resolve('No notification pushed reason: ',"[ID]: ", id, "[Status] ", checker)
            }
            // console.log("counter inside: ", counter);
          })
          // console.log("counter outside: ", counter, "existing: ", existing);

          if (counter == result.length && existing.length == 0) {
            SelectUser(branch)
              .then((validUser) => {
                validUser.forEach((userID) => {
                  let notification_data = [
                    userID,
                    inventoryid,
                    branch,
                    difference,
                    'Low Stocks',
                    'UNREAD',
                    1,
                    helper.GetCurrentDatetime(),
                  ]

                  // console.log(
                  //   "to be inserted [existing phase]: ",
                  //   notification_data
                  // );

                  mysql.InsertTable('notification', [notification_data], (err, result) => {
                    if (err) console.error('Error:)', err)
                    // //console.log(result);
                  })
                })
              })
              .catch((error) => {
                reject(error)
              })
            resolve('success')
          } else {
            resolve('No Notification Pushed!')
          }
        } else {
          // console.log("initial phase: ");
          SelectUser(branch)
            .then((validUser) => {
              validUser.forEach((userID) => {
                let notification_data = [
                  parseInt(userID),
                  parseInt(inventoryid),
                  branch,
                  parseInt(difference),
                  'Low Stocks',
                  'UNREAD',
                  1,
                  helper.GetCurrentDatetime(),
                ]

                // console.log("to be inserted: ", notification_data);
                mysql.InsertTable('notification', [notification_data], (err, result) => {
                  if (err) console.error('Error:)', err)
                  // //console.log(result);
                })
              })
            })
            .catch((error) => {
              reject(error)
            })
          resolve('success')
        }
      })

      SendEmailNotification(branch)
    }
  })
}

function SelectUser(branchid) {
  return new Promise((resolve, reject) => {
    console.log('second phase: ')

    let user_check = `SELECT 
        mu_usercode as userid, mu_employeeid as employeeid, mat_accessname as accesstype, mu_status as status, mu_branchid as branchid 
      FROM salesinventory.master_user 
      INNER JOIN master_access_type on mat_accesscode = mu_accesstype
      WHERE mu_status = 'ACTIVE';`

    mysql.SelectResult(user_check, (err, result) => {
      if (err) reject(err)
      // console.log('3rd phase: ', result)
      if (result.length == 0) {
        reject('no data')
      } else {
        let selecteduser = []
        result.forEach((item) => {
          let userid = item.userid
          let employeeid = item.employeeid
          let accesstype = item.accesstype
          let status = item.status
          let userbranchid = item.branchid

          if (accesstype == 'Manager' && userbranchid == branchid) {
            selecteduser.push(userid)
          }
          if (accesstype == 'Owner') {
            selecteduser.push(userid)
          }
        })

        console.log('third phase selecting users: ', selecteduser)

        resolve(selecteduser)
      }
    })
  })
}

function ProcessedStaffSales(data) {
  const mergedData = {}

  data.forEach((item) => {
    const { cashier, total, branch, description, employeeid } = item
    const key = `${cashier}-${branch}`

    const totalPrice = parseFloat(total)

    if (!mergedData[key]) {
      mergedData[key] = {
        cashier,
        totalSales: totalPrice,
        branch,
        employeeid,
        soldItems: JSON.parse(description).reduce((acc, curr) => {
          const existingItem = acc.find((i) => i.name === curr.name)
          if (existingItem) {
            existingItem.quantity += curr.quantity
            existingItem.totalPrice += curr.price * curr.quantity
          } else {
            acc.push({
              name: curr.name,
              quantity: curr.quantity,
              totalPrice: curr.price * curr.quantity,
            })
          }
          return acc
        }, []),
        commission: totalPrice * 0.04,
      }
    } else {
      mergedData[key].totalSales += totalPrice
      JSON.parse(description).forEach((product) => {
        const existingItem = mergedData[key].soldItems.find((i) => i.name === product.name)
        if (existingItem) {
          existingItem.quantity += product.quantity
          existingItem.totalPrice += product.price * product.quantity // Calculate total price for existing item
        } else {
          mergedData[key].soldItems.push({
            name: product.name,
            quantity: product.quantity,
            totalPrice: product.price * product.quantity, // Include total price for new item
          })
        }
      })
      mergedData[key].commission += totalPrice * 0.04
    }
  })

  const mergedRows = Object.values(mergedData)
  return mergedRows
}

function ProcessDailyPurchasedProduct(data) {
  console.log('ProcessDailyPurchasedProduct:', data)

  const overallQuantityMap = new Map()
  const overallPriceMap = new Map()

  data.forEach((row) => {
    const soldItems = JSON.parse(row.description)

    soldItems.forEach((item) => {
      const { name, quantity, price } = item

      if (overallQuantityMap.has(name)) {
        overallQuantityMap.set(name, overallQuantityMap.get(name) + quantity)
        overallPriceMap.set(name, overallPriceMap.get(name) + quantity * price)
      } else {
        overallQuantityMap.set(name, quantity)
        overallPriceMap.set(name, quantity * price)
      }
    })
  })

  const overallQuantityArray = Array.from(overallQuantityMap, ([productName, quantity]) => ({
    productName,
    quantity,
  }))
  const overallPriceArray = Array.from(overallPriceMap, ([productName, totalPrice]) => ({
    productName,
    totalPrice,
  }))

  const combinedArray = overallQuantityArray.map((item) => ({
    ...item,
    totalPrice:
      overallPriceArray.find(({ productName }) => productName === item.productName)?.totalPrice ||
      0,
  }))

  return combinedArray
}

function SortProducts(data, activeDiscounts) {
  const mergedData = {}
  let overallTotalPrice = 0

  data.forEach((item) => {
    const parsedItem = JSON.parse(item.st_description)

    parsedItem.forEach((product) => {
      const { name, price, quantity, id } = product

      let shouldIncludeProduct = true
      activeDiscounts.forEach((discount) => {
        if (name.toLowerCase().includes(discount.toLowerCase())) {
          shouldIncludeProduct = false
        }
      })

      if (shouldIncludeProduct) {
        if (mergedData[name]) {
          mergedData[name].quantity += quantity
          mergedData[name].price += price * quantity
          mergedData[name].id = parseInt(id)
        } else {
          mergedData[name] = { quantity, price: price * quantity }
        }
        overallTotalPrice += price * quantity
      }
    })
  })
  // console.log(mergedData);
  const sortedProducts = Object.entries(mergedData)
    .map(([productName, productDetails]) => ({
      productName,
      ...productDetails,
    }))
    .sort((a, b) => b.price - a.price)
  const productDetails = {
    sortedProducts: sortedProducts,
    totalPrice: overallTotalPrice,
  }

  return productDetails
}

function GraphData(data, activeDiscounts) {
  const items = {}
  // console.log("graph data:", data);
  data.forEach((entry) => {
    const itemsArray = JSON.parse(entry.st_description)
    itemsArray.forEach((item) => {
      let shouldIncludeItem = true
      activeDiscounts.forEach((discount) => {
        if (item.name.toLowerCase().includes(discount.toLowerCase())) {
          shouldIncludeItem = false
        }
      })

      if (shouldIncludeItem) {
        if (!items[item.name]) {
          items[item.name] = {
            name: item.name,
            totalPrice: item.price * item.quantity,
          }
        } else {
          items[item.name].totalPrice += item.price * item.quantity
        }
      }
    })
  })
  // console.log("items:", items);
  const aggregatedItems = Object.values(items)
  aggregatedItems.sort((a, b) => b.totalPrice - a.totalPrice)
  const topItems = aggregatedItems.slice(0, 5)

  return topItems
}

function MergeObjects(data) {
  const mergedData = {
    branch: [],
    totalSales: 0,
    soldItems: [],
    commission: 0,
    totalQuantity: 0,
    employeeid: null, // Initialize employeeid as null
  }

  data.forEach((entry) => {
    mergedData.branch.push(entry.branch)
    mergedData.totalSales += entry.totalSales

    // Add employeeid if it's not already set
    if (!mergedData.employeeid) {
      mergedData.employeeid = entry.employeeid
    }

    entry.soldItems.forEach((item) => {
      const existingItem = mergedData.soldItems.find((i) => i.name === item.name)
      if (existingItem) {
        existingItem.quantity += item.quantity
        existingItem.totalPrice += item.totalPrice
      } else {
        mergedData.soldItems.push({ ...item })
      }
      mergedData.totalQuantity += item.quantity
    })

    mergedData.commission += entry.commission
  })

  return mergedData
}

function SendEmailNotification(branch) {
  return new Promise((resolve, reject) => {
    let sql = `select 
                mb_branchname as branchname,
                mp_description as productname,
                pi_quantity as quantity
                from product_inventory
                inner join master_product on pi_productid = mp_productid
                inner join master_branch on pi_branchid = mb_branchid
                where pi_quantity <= 15
                and pi_branchid = ?`
    let cmd = helper.SelectStatement(sql, [branch])
    const date = helper.GetCurrentDatetime()

    mysql.SelectResult(cmd, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const branchname = result[0].branchname
        SendEmail(
          `${process.env._EMAIL_TO}`,
          `Stock Alert - ${branch}(${branchname})`,
          helper.StocksNotificationEmail(result, `${branch} - ${branchname}`, date)
        )
        resolve(result)
      }
    })
  })
}

//#endregion
