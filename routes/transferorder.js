var express = require('express')
var router = express.Router()

const mysql = require('./repository/bmssdb')
const helper = require('./repository/customhelper')
const dictionary = require('./repository/dictionary')
const { Validator } = require('./controller/middleware')
const { SendEmail } = require('./repository/mailer')
const { EmailContent } = require('./repository/customhelper')
const { DataModeling } = require('./model/bmssmodel')

/* GET home page. */
router.get('/', function (req, res, next) {
  Validator(req, res, 'transferorder')
})

module.exports = router

router.get('/load', (req, res) => {
  try {
    let sql = `SELECT to_transferid as transferid, 
            to_fromlocationid as fromlocationid, 
            to_tolocationid as tolocationid, 
            from_loc.mb_branchname as fromlocbranchname,
            to_loc.mb_branchname as tolocbranchname,
            to_transferdate as transferdate,
            to_totalquantity as totalquantity, 
            to_status as status, 
            to_notes as notes 
          FROM transfer_orders
          INNER JOIN master_branch as from_loc ON to_fromlocationid = from_loc.mb_branchid
          INNER JOIN master_branch as to_loc ON to_tolocationid = to_loc.mb_branchid
          ORDER BY to_transferid DESC`

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
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

router.post('/save', (req, res) => {
  try {
    let fromlocationid = req.body.fromlocationid
    let tolocationid = req.body.tolocationid
    let transferdate = req.body.transferdate
    let totalquantity = req.body.totalquantity
    let status = dictionary.GetValue(dictionary.PND())
    let notes = req.body.notes
    let accesstype = req.session.accesstype
    let branch = req.session.branchid
    let fullname = req.session.fullname
    let data = []

    data.push([fromlocationid, tolocationid, transferdate, totalquantity, status, notes])

    mysql.InsertTable('transfer_orders', data, (err, result) => {
      if (err) console.error('Error: ', err)
      let transferid = result[0]['id']
      let toidata = JSON.parse(req.body.toidata)

      toidata.forEach(function (item, index) {
        const { productid, quantity, destinationStocks } = item

        let rowData = [transferid, productid, quantity, destinationStocks]

        mysql.InsertTable('transfer_order_items', [rowData], (err, result) => {
          if (err) console.error('Error: ', err)
          //console.log('Data successfully inserted: ' + result)
        })
      })

      Notification(accesstype, branch, fullname)
        .then((response) => {
          //console.log(response)
        })
        .catch((err) => {
          console.log(err)
        })

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

router.post('/approve', (req, res) => {
  try {
    const transferid = req.body.transferid
    const frombranch = req.body.frombranch
    let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.APD())
        : dictionary.GetValue(dictionary.PND())

    // let type = dictionary.GetValue(dictionary.TRF());
    // let createdby = req.session.fullname;
    // let createdate = helper.GetCurrentDatetime();
    let data = [status, transferid]
    //console.log(data)

    let sql_Update = `UPDATE transfer_orders SET to_status = ? WHERE to_transferid = ?`

    let sql_select_transfer_items = `SELECT * FROM transfer_order_items WHERE toi_transferid = '${transferid}'`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      mysql.Select(sql_select_transfer_items, 'TransferOrderItems', (err, result) => {
        if (err) console.error('Error: ', err)
        //console.log(result)
        result.forEach((item) => {
          const productid = item.productid
          const quantity = item.quantity
          const inventoryid = productid + frombranch

          const select_inventory = `select pi_quantity from product_inventory where pi_inventoryid = '${productid}${frombranch}'`
          //console.log(`Inventory id: ${inventoryid}`)
          mysql.Select(select_inventory, 'ProductInventory', (err, result) => {
            if (err) {
              return res.json({
                msg: err,
              })
            }
            currentquantity = result[0].quantity
            const sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`

            const finalquantity = parseFloat(currentquantity) - parseFloat(quantity)
            const deduct_data = [finalquantity, inventoryid]

            mysql.UpdateMultiple(sql_add, deduct_data, (err, result) => {
              if (err) console.error('Error: ', err)
            })

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
                frombranch,
                quantity * -1,
                helper.GetCurrentDatetime(),
                productid,
                inventoryid,
                transferid,
                'TRANSFER',
                finalquantity,
              ],
            ]

            mysql.Insert(record_query, history_date, (err, result) => {
              if (err) {
                console.log(err)
                res.status(400), res.json({ msg: err })
              }
            })
          })
        })
      })

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

router.post('/report', (req, res) => {
  try {
    const transferid = req.body.transferid
    const branch = req.body.branch
    const status =
      req.body.status == dictionary.GetValue(dictionary.APD())
        ? dictionary.GetValue(dictionary.CMP())
        : dictionary.GetValue(dictionary.APD())
    const type = dictionary.GetValue(dictionary.TRF())
    const createdby = req.session.fullname
    const createdate = helper.GetCurrentDatetime()
    const data = [status, transferid]

    const sql_Update = `UPDATE transfer_orders  SET to_status = ? WHERE to_transferid = ?`

    const sql_select_transfer_items = `SELECT * FROM transfer_order_items WHERE toi_transferid = '${transferid}'`

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error('Error: ', err)

      mysql.Select(sql_select_transfer_items, 'TransferOrderItems', (err, result) => {
        if (err) console.error('Error: ', err)
        //console.log(result)
        result.forEach((item) => {
          const productid = item.productid
          const quantity = item.quantity
          const inventoryid = productid + branch

          const select_inventory = `select pi_quantity from product_inventory where pi_inventoryid = '${productid}${branch}'`

          mysql.Select(select_inventory, 'ProductInventory', (err, result) => {
            if (err) {
              return res.json({
                msg: err,
              })
            }
            currentquantity = result[0].quantity
            const sql_add = `UPDATE product_inventory SET pi_quantity = ? WHERE pi_inventoryid = ?`

            const finalquantity = parseFloat(currentquantity) + parseFloat(quantity)
            const add_data = [finalquantity, inventoryid]

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
                transferid,
                'TRANSFER',
                finalquantity,
              ],
            ]

            mysql.Insert(record_query, history_date, (err, result) => {
              if (err) {
                console.log(err)
                res.status(400), res.json({ msg: err })
              }
            })

            mysql.UpdateMultiple(sql_add, add_data, (err, result) => {
              if (err) console.error('Error: ', err)
            })
          })

          let rowData = [inventoryid, quantity, type, createdate, createdby]

          mysql.InsertTable('inventory_history', [rowData], (err, result) => {
            if (err) console.error('Error: ', err)
            //console.log('Data successfully inserted: ' + result)
          })
        })
      })

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

router.post('/cancel', (req, res) => {
  try {
    let transferid = req.body.transferid
    let status =
      req.body.status == dictionary.GetValue(dictionary.PND())
        ? dictionary.GetValue(dictionary.CND())
        : dictionary.GetValue(dictionary.PND())
    let data = [status, transferid]
    //console.log(data)

    let sql_Update = `UPDATE transfer_orders 
                    SET to_status = ?
                    WHERE to_transferid = ?`

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

router.get('/loadsampleitem', (req, res) => {
  try {
    let sql = `select * from sample_itemlists`

    mysql.Select(sql, 'SampleItemLists', (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        })
      }

      //console.log(helper.GetCurrentDatetime())

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

router.post('/getitemdetails', (req, res) => {
  try {
    let description = req.body.description
    let sql = `select * from sample_itemlists where sil_description = '${description}'`

    mysql.Select(sql, 'SampleItemLists', (err, result) => {
      if (err) {
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

router.post('/gettransferdetails', (req, res) => {
  try {
    let transferid = req.body.transferid
    let sql = `SELECT toi_itemid, toi_transferid, toi_productid, toi_quantity, toi_destinationStocks, mp_description AS toi_productname
        FROM transfer_order_items 
        INNER JOIN master_product ON mp_productid = toi_productid
        WHERE toi_transferid = '${transferid}'`

    mysql.SelectResult(sql, (err, result) => {
      // //console.log(result);
      if (err) {
        return res.json({
          msg: err,
        })
      }
      const data = DataModeling(result, 'toi_')
      res.json({
        msg: 'success',
        data: data,
      })
    })
  } catch (error) {
    res.json({
      msg: error,
    })
  }
})

router.post('/getapprovaldetails', (req, res) => {
  try {
    let transferid = req.body.transferid
    let branchid = req.body.branchid

    //console.log('transferid: ' + transferid, 'branchid: ' + branchid)
    let sql = `
      SELECT to_transferid as transferid, from_location.mb_branchname as fromlocation, to_fromlocationid as fromid, to_location.mb_branchname as tolocation, 
        to_tolocationid as toid, prod_desc.mp_description as productname, toi_productid as productid, toi_quantity as totransferquantity, pi_quantity as fromcurrentstocks, toi_destinationStocks as destinationStocks
      FROM transfer_orders
      INNER JOIN transfer_order_items ON toi_transferid = to_transferid
      INNER JOIN product_inventory  ON toi_productid = pi_productid
      INNER JOIN master_branch as from_location ON to_fromlocationid = from_location.mb_branchid
      INNER JOIN master_branch as to_location ON to_tolocationid = to_location.mb_branchid
      INNER JOIN master_product as prod_desc ON toi_productid = prod_desc.mp_productid
      WHERE to_transferid = '${transferid}' AND to_fromlocationid = '${branchid}' AND pi_branchid = '${branchid}' AND pi_productid = toi_productid;`

    mysql.SelectResult(sql, (err, result) => {
      //console.log(result)
      if (err) {
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

router.post('/send-mail', (req, res) => {
  try {
    const { transferid, receiverName, receiverEmail } = req.body
    const supervisor = req.session.fullname
    // console.log(supervisor, transferid, receiverName, receiverEmail);
    if (!transferid || !receiverName || !receiverEmail || !supervisor) {
      res.status(400), res.json({ msg: 'All fields are required' })
    }

    const selectTransferDetails = `SELECT 
    to_transferid AS transferid, fromBranch.mb_branchname AS fromLocation, to_fromlocationid AS fromId, 
        toBranch.mb_branchname AS toLocation, to_tolocationid AS toId, to_totalquantity as totalQuantity, to_notes as notes 
    FROM salesinventory.transfer_orders 
    INNER JOIN 
      master_branch AS fromBranch 
    ON fromBranch.mb_branchid = to_fromlocationid
    INNER JOIN 
      master_branch AS toBranch
    ON toBranch.mb_branchid = to_tolocationid WHERE to_transferid = ${transferid};`
    mysql.SelectResult(selectTransferDetails, (err, result) => {
      if (err) {
        return (
          res.status(400),
          res.json({
            msg: err,
          })
        )
      }
      const transferDetails = result

      const selectTransferItems = `SELECT toi_itemid AS id, mp_description as productName, toi_productid as productId, toi_quantity as quantity 
      FROM salesinventory.transfer_order_items 
      INNER JOIN master_product ON mp_productid = toi_productid 
      WHERE toi_transferid = ${transferid};`

      mysql.SelectResult(selectTransferItems, (err, result) => {
        if (err) {
          return (
            res.status(400),
            res.json({
              msg: err,
            })
          )
        }

        const transferItems = result

        SendEmail(
          receiverEmail,
          'Asvesti Product Transfer',
          EmailContent(transferDetails, transferItems, receiverName, supervisor)
        )

        res.json({ msg: 'success' })
      })
    })
  } catch (error) {
    console.log(error)
    res.status(404), res.json({ msg: error })
  }
})

//#region Functions

function Notification(accesstype, branch, fullname) {
  return new Promise((resolve, reject) => {
    if (accesstype == 'Manager') {
      SelectUser()
        .then((user) => {
          user.forEach((userID) => {
            let notification_data = [
              'TRANSFER ORDER',
              userID,
              branch,
              `${fullname} has requested a Transfer Order`,
              'UNREAD',
              helper.GetCurrentDatetime(),
            ]

            mysql.InsertTable('request_notification', [notification_data], (err, result) => {
              if (err) console.error('Error:)', err)
              //console.log(result)
            })
          })
          resolve('Notification Pushed')
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}

function SelectUser() {
  return new Promise((resolve, reject) => {
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

          if (accesstype == 'Owner') {
            selecteduser.push(userid)
          }
        })

        resolve(selecteduser)
      }
    })
  })
}

//#endregion
