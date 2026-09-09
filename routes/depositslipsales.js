const express = require('express')
const router = express.Router()

const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const verifyJWT = require('../repository/middleware/authenticator')
const { SelectAll, Query, Check, Transaction } = require('../repository/utility/query.util')
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
  GenerateUUID,
  UpdateStatementNoPrefix,
  GetPreviousMonthFirstDay,
  GetCurrentMonthLastDay
} = require('../repository/helper/customhelper')
const { Cash } = require('../database/model/Cash')
const { DataModeling } = require('../repository/model/bmssmodel')
const { Select, Insert, SelectWithCondition, Update, Delete } = require('../repository/helper/dnconnect')
const { InsertDynamic, Selects, InsertTable, SelectResult } = require('../repository/helper/bmssdb')
const { UPSERT_STATUS } = require('../repository/helper/enums')
const { INF, MSTR, GetValue, INSD, PND } = require('../repository/helper/dictionary')
const { Sale } = require('../database/model/Sale')

router.get('/', function (req, res, next) {
  Validator(req, res, 'depositslipsales')
})

router.get('/get-cash-deposit-slip-sales', (req, res) => {
  try {
    let start_date = req.query.start_date ?? GetPreviousMonthFirstDay();
    let end_date = req.query.end_date ?? GetCurrentMonthLastDay();

    async function ProcessData() {
      let cash_deposit_slip_sales = SelectStatement(`select cash_deposit_slip_sales.* from cash_deposit_slip_sales
          inner join sales_detail on st_detail_id = cdss_sales_id
          where st_date between ? and ?
          and cdss_status = 'pending'`, [start_date, end_date])


      let result = await Select(cash_deposit_slip_sales)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, Cash.cash_deposit_slip_sales.prefix_)))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.get('/filter-cash-deposit-slip-sales/:daterange/:status', (req, res) => {
  try {

    const { daterange, status } = req.params;
    let [start_date, end_date] = daterange.split(' - ');
    let cash_deposit_slip_sales = '';

    async function ProcessData() {
      let parameters = [start_date, end_date];

      cash_deposit_slip_sales = `select cash_deposit_slip_sales.* from cash_deposit_slip_sales
          inner join sales_detail on st_detail_id = cdss_sales_id
          where st_date between ? and ?`;

      if (status != 'ALL') {
        cash_deposit_slip_sales += ` and cdss_status = ?`
        parameters.push(status)
      }

      cash_deposit_slip_sales = SelectStatement(cash_deposit_slip_sales, parameters);
      
      let result = await Select(cash_deposit_slip_sales)

      if (result.length != 0) {
        res.status(200).json(JsonResponseData(DataModeling(result, Cash.cash_deposit_slip_sales.prefix_)))
      } else {
        res.status(200).json(JsonResponseData(result))
      }
    }

    ProcessData()
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})

router.put('/update-cash-deposit-slip-sales', (req, res) => {
  try {
    const { sales_id, branch_id } = req.body;
    let queries = [];

    async function ProcessData() {
      let select_sales_details = SelectStatement(SelectStatementCondition(
        Sale.sales_detail.tablename,
        [
          Sale.sales_detail.selectOptionColumns.description,
          Sale.sales_detail.selectOptionColumns.date,
        ],
        [Sale.sales_detail.selectOptionColumns.detail_id]), [sales_id]);

      let result = await Select(select_sales_details);
      const details = JSON.parse(result[0].st_description);
      const sales_date = result[0].st_date

      for (const detail of details) {
        const { id, name, price, quantity } = detail;
        const dprice = parseFloat(price)
        const dquantity = parseFloat(quantity)
        const total = price * quantity

        if (name.includes('Discount')) {
          continue
        }

        if (name.includes('Srv')) {
          continue
        }

        if (name.includes('Pckg')) {
          let select_package = SelectStatement(`SELECT * FROM package where p_id = ?`, [id])
          let packageResult = await Select(select_package)
          let packages = DataModeling(packageResult, 'p_')

          let package_details = JSON.parse(packages[0].details)

          for (var package of package_details) {
            //console.log(package)
            const { productname, branchid, price, quantity } = package
            //console.log(productname, branchid, price, quantity)
            let package_total = parseFloat(price) * parseFloat(quantity)

            if (productname.includes('Srv')) {
              continue
            }

            let select_product = SelectStatement(
              `select mp_productid as package_productid from master_product where mp_description = ?`,
              [productname],
            )
            let productResult = await Select(select_product)
            const { package_productid } = productResult[0]

            const package_productid_inventory_id = `${package_productid}${branchid}`

            //#region Package Products
            queries.push({
              sql: `INSERT INTO sales_item(si_detail_id, si_date,si_item,si_price,si_quantity,si_total) VALUES (?,?,?,?,?,?)`,
              values: [
                detailid,
                date,
                package_productid_inventory_id,
                price,
                quantity,
                package_total,
              ],
            }) // Sales Items

            //console.log(queries)

            let product_sql = SelectStatement(
              'select mp_productid as productid from master_product where mp_productid=?',
              [package_productid],
            )

            const current_stock = await getInventory(branch_id, package_productid)

            //console.log(current_stock)
            const stocks = parseInt(current_stock)
            const stocksafter = stocks - quantity * dquantity
            const product_details = await Select(product_sql)
            //console.log(product_details)
            const productid = product_details[0].productid
            const inventoryid = `${package_productid}${branch_id}`

            queries.push({
              sql: `INSERT INTO history(h_branch,h_quantity,h_date,h_productid,h_inventoryid,h_movementid,h_type,h_stocksafter) VALUES (?,?,?,?,?,?,?,?)`,
              values: [
                branch,
                quantity * dquantity,
                GetCurrentDatetime(),
                productid,
                inventoryid,
                detailid,
                'SALES',
                stocksafter,
              ],
            }) //History Inventory

            //console.log(queries)

            let check_product_inventory = SelectStatement(
              'select pi_quantity as quantity from product_inventory where pi_inventoryid=?',
              [package_productid_inventory_id],
            )

            let product_inventory = await Select(check_product_inventory)
            //console.log(product_inventory)
            const currentquantity = parseFloat(product_inventory[0].quantity)
            const deductionquantity = parseFloat(quantity) * parseFloat(dquantity)
            const difference = currentquantity - deductionquantity

            queries.push({
              sql: UpdateStatement('product_inventory', 'pi', ['quantity'], ['inventoryid']),
              values: [difference, package_productid_inventory_id],
            })
            //console.log(queries)

            //console.log(package_productid_inventory_id, difference, branch)

            Notification(package_productid_inventory_id, difference, branch_id)
            //#endregion
          }

          continue
        }

        const current_stock = await getInventory(branch_id, name)
        let product_sql = SelectStatement(
          'select mp_productid as productid from master_product where mp_description=? or mp_productid=?',
          [name, id],
        )

        const product_details = await Select(product_sql)
        const stocks = parseInt(current_stock)
        const stocksafter = stocks - dquantity

        const productid = product_details[0].productid
        const inventoryid = `${productid}${branch_id}`

        queries.push({
          sql: `INSERT INTO sales_item(si_detail_id, si_date,si_item,si_price,si_quantity,si_total) VALUES (?,?,?,?,?,?)`,
          values: [sales_id, sales_date, productid, dprice, dquantity, total],
        }) // Sales Items

        queries.push({
          sql: `INSERT INTO history(h_branch,h_quantity,h_date,h_productid,h_inventoryid,h_movementid,h_type,h_stocksafter) VALUES (?,?,?,?,?,?,?,?)`,
          values: [
            branch_id,
            quantity,
            GetCurrentDatetime(),
            productid,
            inventoryid,
            sales_id,
            'SALES',
            stocksafter,
          ],
        }) //History Inventory

        let check_product_inventory = SelectStatement(
          'select pi_quantity as quantity from product_inventory where pi_inventoryid=?',
          [inventoryid],
        )
        let product_inventory = await Select(check_product_inventory)
        const currentquantity = parseFloat(product_inventory[0].quantity)
        const deductionquantity = parseFloat(quantity)
        const difference = currentquantity - deductionquantity

        queries.push({
          sql: UpdateStatement('product_inventory', 'pi', ['quantity'], ['inventoryid']),
          values: [difference, inventoryid],
        })


        let update_sales_details = UpdateStatementNoPrefix(
          Sale.sales_detail.tablename,
          [Sale.sales_detail.selectOptionColumns.status],
          [Sale.sales_detail.selectOptionColumns.detail_id])

        queries.push({
          sql: update_sales_details,
          values: [GetValue('SLD'), sales_id],
        })

        SendInventoryNotification(inventoryid, difference, branch_id)
      }

      let update_cash_deposit_slip_sales = UpdateStatementNoPrefix(
        Cash.cash_deposit_slip_sales.tablename,
        [Cash.cash_deposit_slip_sales.selectOptionColumns.status],
        [Cash.cash_deposit_slip_sales.selectOptionColumns.sales_id])

      queries.push({
        sql: update_cash_deposit_slip_sales,
        values: [GetValue('VRFY'), sales_id],
      })

      await Transaction(queries)

      res.status(200).json(JsonResponseSuccess());
    }

    ProcessData()
  } catch (error) {
    console.log(error)
    res.status(500).json(JsonResponseError(error))
  }
})


//#region Functions

function SelectUser(branchid) {
  return new Promise((resolve, reject) => {
    //console.log('second phase: ')

    let user_check = `SELECT 
        mu_usercode as userid, mu_employeeid as employeeid, mat_accessname as accesstype, mu_status as status, mu_branchid as branchid 
      FROM master_user 
      INNER JOIN master_access_type on mat_accesscode = mu_accesstype
      WHERE mu_status = 'ACTIVE';`

    SelectResult(user_check, (err, result) => {
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
        resolve(selecteduser)
      }
    })
  })
}

function getInventory(branch, productid) {
  // console.log(branch, productid)
  return new Promise((resolve, reject) => {
    let sql = SelectStatement(
      `select pi_quantity as stock 
      from product_inventory 
      inner join master_product on mp_productid = pi_productid
      where pi_branchid =?
      and mp_description=?
      or mp_productid=?`,
      [branch, productid, productid],
    )

    // console.log(sql)

    SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        //console.log(result)
        resolve(result[0].stock)
      }
    })
  })
}

function SendInventoryNotification(inventoryid, difference, branch) {
  return new Promise((resolve, reject) => {
    if (difference <= 15) {
      let check_notification = `SELECT 
            n_id as id, n_userid as userid, n_inventoryid as inventoryid, n_branchid as branchid, 
            n_quantity as quantity, n_message as message, n_status as status, n_checker as checker
          FROM notification WHERE n_inventoryid = '${inventoryid}' AND n_branchid = '${branch}'`

      SelectResult(check_notification, (err, result) => {
        if (err) {
          reject(err)
        }
        // console.log('initial phase[existing]: ', result)

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
                    GetCurrentDatetime(),
                  ]

                  // console.log(
                  //   "to be inserted [existing phase]: ",
                  //   notification_data
                  // );

                  InsertTable('notification', [notification_data], (err, result) => {
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
          console.log('initial phase: ')
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
                  GetCurrentDatetime(),
                ]

                console.log('to be inserted: ', notification_data)
                InsertTable('notification', [notification_data], (err, result) => {
                  if (err) console.error('Error:)', err)
                  console.log(result)

                  // SendEmailNotification(branch)
                })
              })
            })
            .catch((error) => {
              reject(error)
            })
          resolve('success')
        }
      })
    }
  })
}


//#endregion


module.exports = router
