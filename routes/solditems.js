const express = require('express')
const router = express.Router()

const { Logger } = require('../repository/helper/logger')
const { Validator } = require('../repository/controller/middleware')
const verifyJWT = require('../repository/middleware/authenticator')
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
  GetCurrentDate,
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
const { SelectResult } = require('../repository/helper/bmssdb')

router.get('/', function (req, res, next) {
  Validator(req, res, 'solditems')
})

router.get('/load', (req, res) => {
  try {
    async function ProcessData() {
      let currentdate = GetCurrentDate()
      let select_sql = SelectStatement(
        `
      select 
      st_date as datetime, 
      st_pos_id as pos_id, 
      st_shift as shift, 
      st_branch as branch, 
      st_description as description
      from sales_detail 
      where st_status = 'SOLD'
      and st_date between ? and ?`,
        [`${currentdate} 00:00:00`, `${currentdate} 23:59:59`]
      )

      let select_product_sql = SelectStatement(`
       select
      pi_branchid as branch_id,
      mp_productid as product_id, 
      mp_description as product_name, 
      mp_category as category_id,
      mc_categoryname as category_name
      from master_product
      inner join master_category on mc_categorycode = mp_category
      inner join product_inventory on pi_productid = mp_productid and pi_category = mp_category
      order by product_id`)

      let result = await Select(select_sql)
      let productResult = await Select(select_product_sql)

      let soldItems = []

      //#region Get Products

      for (var r in productResult) {
        const { branch_id, category_name, product_name } = productResult[r]
        let branchDetails = await getBranch(branch_id)
        const { branchname } = branchDetails[0]

        soldItems.push({
          branch: branchname,
          category: category_name,
          name: product_name,
          quantity: 0,
        })
      }

      //#endregion

      //#region Get Sold Product Details
      for (var r in result) {
        const { datetime, pos_id, shift, branch, description } = result[r]
        let details = JSON.parse(description)
        let branchDetails = await getBranch(branch)
        const { branchname } = branchDetails[0]

        for (var d in details) {
          const { id, name, quantity, price } = details[d]

          if (name.includes('Discount')) {
            continue
          }

          let productCategory = await getCategory(id)

          const { category } = productCategory[0]

          if (soldItems.find((item) => item.name === name && item.branch === branchname)) {
            soldItems.find((item) => item.name === name && item.branch === branchname).quantity +=
              quantity
          } else {
            soldItems.push({
              branch: branchname,
              category: category,
              name: name,
              quantity: quantity,
            })
          }
        }
      }
      //#endregion

      res.status(200).json(JsonResponseData(soldItems.sort((a, b) => a.name.localeCompare(b.name))))
    }

    ProcessData()
  } catch (error) {
    res.status(500).json(JsonResponseError(error))
  }
})

router.get(
  '/filter/:daterange/:product_category/:product_branch/:product_name',
  async (req, res) => {
    try {
      async function ProcessData() {
        const { daterange, product_category, product_branch, product_name } = req.params
        let [startdate, enddate] = daterange.split(' - ')
        let select_data = []
        let categoryname = '';

        let sql = `select 
      st_date as datetime, 
      st_pos_id as pos_id, 
      st_shift as shift, 
      st_branch as branch, 
      st_description as description
      from sales_detail 
      where st_status = 'SOLD'
      and st_date between ? and ?`

        let select_product_sql = SelectStatement(`
        select
       pi_branchid as branch_id,
       mp_productid as product_id, 
       mp_description as product_name, 
       mp_category as category_id,
       mc_categoryname as category_name
       from master_product
       inner join master_category on mc_categorycode = mp_category
       inner join product_inventory on pi_productid = mp_productid and pi_category = mp_category`)

        select_data.push(`${startdate} 00:00:00`, `${enddate} 23:59:59`)

        if (product_branch != 'ALL') {
          select_data.push(product_branch)
          sql += ` and st_branch = ?`
          select_product_sql += ` WHERE pi_branchid = ?`
        }

        let select_sql = SelectStatement(sql, select_data)
        let select_product = SelectStatement(select_product_sql, [product_branch])

        let result = await Select(select_sql)
        let productResult = await Select(select_product)

        let soldItems = []

        //#region Get Products

        for (var r in productResult) {
          const { branch_id, category_name, product_name } = productResult[r]
          categoryname = category_name;
          let branchDetails = await getBranch(branch_id)
          const { branchname } = branchDetails[0]

          soldItems.push({
            branch: branchname,
            category: category_name,
            name: product_name,
            quantity: 0,
          })
        }
        //#endregion

        //#region Get Sold Product Details

        for (var r in result) {
          const { datetime, pos_id, shift, branch, description } = result[r]
          let details = JSON.parse(description)
          let branchDetails = await getBranch(branch)
          const { branchname } = branchDetails[0]

          for (var d in details) {
            const { id, name, quantity, price } = details[d]

            if (name.includes('Discount')) {
              continue
            }

            if (product_name != 'ALL') {
              if (!name.toLowerCase().includes(product_name.toLowerCase())) {
                continue
              }

              let productCategory = await getCategory(id)

              const { category } = productCategory[0]

              if (soldItems.find((item) => item.name === name && item.branch === branchname)) {
                soldItems.find(
                  (item) => item.name === name && item.branch === branchname
                ).quantity += quantity
              } else {
                soldItems.push({
                  branch: branchname,
                  category: category,
                  name: name,
                  quantity: quantity,
                })
              }
            } else {
              let productCategory = await getCategory(id)

              const { category } = productCategory[0]

              if (soldItems.find((item) => item.name === name && item.branch === branchname)) {
                soldItems.find(
                  (item) => item.name === name && item.branch === branchname
                ).quantity += quantity
              } else {
                soldItems.push({
                  branch: branchname,
                  category: category,
                  name: name,
                  quantity: quantity,
                })
              }
            }
          }
        }

        //#endregion

        console.log(soldItems)

        let data =
          product_category == 'ALL'
            ? soldItems.sort((a, b) => a.name.localeCompare(b.name))
            : soldItems
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter((item) => item.category === categoryname)

        console.log(data)

        res.status(200).json(JsonResponseData(data))
      }

      ProcessData()
    } catch (error) {
      res.json({
        msg: error,
      })
    }
  }
)
//#region Functions
async function getCategory(productid) {
  return new Promise((resolve, reject) => {
    let select_sql = SelectStatement(
      `select 
      mc_categoryname as category,
      mp_description as product from master_category
      inner join master_product
      on mc_categorycode = mp_category
      where mp_productid = ?`,
      [productid]
    )

    SelectResult(select_sql, (error, result) => {
      if (error) {
        reject(error)
      }

      resolve(result)
    })
  })
}

async function getBranch(branchid) {
  return new Promise((resolve, reject) => {
    let select_sql = SelectStatement(
      `select 
        mb_branchname as branchname
        from master_branch
        where mb_branchid = ?`,
      [branchid]
    )

    SelectResult(select_sql, (error, result) => {
      if (error) {
        reject(error)
      }

      resolve(result)
    })
  })
}
//#endregion

module.exports = router
