const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
require('dotenv').config()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BMSS API Documentation',
      version: '1.0.0',
      description: 'BMSS API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
      {
        url: `http://172.16.10.202:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./repository/documentation/*.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)
module.exports = swaggerDocs

//Login
/**
 * @swagger
 * 
 * /authentication:
 *   post:
 *     summary: Authenticate user
 *     description: Allows authentication using either JSON or form-urlencoded input.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "5L Solutions"
 *               password:
 *                 type: string
 *                 example: "5L Secret Key"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "5L Solutions"
 *               password:
 *                 type: string
 *                 example: "5L Secret Key"

 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "Owner"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// Customer
/**
 * @swagger
 *
 * /customer/get-customer:
 *   get:
 *     description: Get Customer
 *     tags:
 *       - customer
 *     responses:
 *       200:
 *         description: Customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       type:
 *                         type: string
 *                         example: "Customer"
 *                       company:
 *                         type: string
 *                         example: "5L Solutions"
 *                       fullname:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@gmail.com"
 *                       phone:
 *                         type: string
 *                         example: "1234567890"
 *                       mobile:
 *                         type: string
 *                         example: "1234567890"
 *                       address:
 *                         type: string
 *                         example: "123 Main Street, Anytown USA"
 *                       create_at:
 *                         type: string
 *                         example: "2022-01-01 12:00:00"
 *                       create_by:
 *                         type: string
 *                         example: "5L Solutions"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 *
 * /customer/add-customer:
 *   post:
 *     summary: Add Customer
 *     description: Add a new customer with details
 *     tags:
 *       - customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Customer"
 *               company:
 *                 type: string
 *                 example: "5L Solutions"
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Anytown USA"
 *               create_at:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               create_by:
 *                 type: string
 *                 example: "5L Solutions"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Anytown USA"
 *               create_at:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               create_by:
 *                 type: string
 *                 example: "5L Solutions"
 *     responses:
 *       200:
 *         description: Customer added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 *
 * /customer/edit-customer:
 *   put:
 *     summary: Edit Customer
 *     description: Edit a customer with details
 *     tags:
 *       - customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: "Customer"
 *               company:
 *                 type: string
 *                 example: "5L Solutions"
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Anytown USA"
 *               create_at:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               create_by:
 *                 type: string
 *                 example: "5L Solutions"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: "Customer"
 *               company:
 *                 type: string
 *                 example: "5L Solutions"
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Anytown USA"
 *               create_at:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               create_by:
 *                 type: string
 *                 example: "5L Solutions"
 *     responses:
 *       200:
 *         description: Customer edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /customer/delete-customer:
 *   delete:
 *     summary: Delete Customer
 *     description: Delete a customer with details
 *     tags:
 *       - customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */

/**
 * @swagger
 * /customer/get-customer-transaction:
 *   get:
 *     summary: Get Customer Transaction
 *     description: Get Customer Transaction
 *     tags:
 *       - customer
 *     responses:
 *       200:
 *         description: Customer Transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       customer_id:
 *                         type: integer
 *                         example: 1
 *                       sales_id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "1"
 *                       create_at:
 *                         type: string
 *                         example: "2022-01-01 12:00:00"
 *                       create_by:
 *                         type: string
 *                         example: "5L Solutions"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /customer/add-customer-transaction:
 *   post:
 *     summary: Add Customer Transaction
 *     description: Add a new customer transaction with details
 *     tags:
 *       - customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               sales_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: "1"
 *               create_at:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               sales_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: "1"
 *               create_at:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *     responses:
 *       200:
 *         description: Customer Transaction added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

//Access
/**
 * @swagger
 * /access/load:
 *   get:
 *     summary: Load Access
 *     description: Load Access
 *     tags:
 *       - access
 *     responses:
 *       200:
 *         description: Access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       accesscode:
 *                         type: string
 *                         example: "1"
 *                       accessname:
 *                         type: string
 *                         example: "1"
 *                       status:
 *                         type: string
 *                         example: "1"
 *                       createdby:
 *                         type: string
 *                         example: "5L Solutions"
 *                       createdate:
 *                         type: string
 *                         example: "2022-01-01 12:00:00"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /access/save:
 *   post:
 *     summary: Save Access
 *     description: Save Access
 *     tags:
 *       - access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessname:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *     responses:
 *       200:
 *         description: Access saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /access/status:
 *   put:
 *     summary: Status Access
 *     description: Status Access
 *     tags:
 *       - access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accesscode:
 *                 type: string
 *                 example: "1"
 *               status:
 *                 type: string
 *                 example: "1"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               accesscode:
 *                 type: string
 *                 example: "1"
 *               status:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Access status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /access/edit:
 *   put:
 *     summary: Edit Access
 *     description: Edit Access
 *     tags:
 *       - access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessnamemodal:
 *                 type: string
 *                 example: "1"
 *               accesscode:
 *                 type: string
 *                 example: "1"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               accessnamemodal:
 *                 type: string
 *                 example: "1"
 *               accesscode:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       200:
 *         description: Access edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */


//ProductPrice

/**
 * @swagger
 * /productprice/load:
 *   get:
 *     summary: Load ProductPrice
 *     description: Load ProductPrice
 *     tags:
 *       - productprice
 *     responses:
 *       200:
 *         description: ProductPrice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productprice:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productpriceid:
 *                         type: integer
 *                         example: 1
 *                       productid:
 *                         type: integer
 *                         example: 1
 *                       description:
 *                         type: string
 *                         example: "1"
 *                       barcode:
 *                         type: string
 *                         example: "1"
 *                       productimage:
 *                         type: string
 *                         example: "1"
 *                       price:
 *                         type: string
 *                         example: "1"
 *                       category:
 *                         type: string
 *                         example: "1"
 *                       previousprice:
 *                         type: string
 *                         example: "1"
 *                       pricechange:
 *                         type: string
 *                         example: "1"
 *                       pricechangedate:
 *                         type: string
 *                         example: "2022-01-01 12:00:00"
 *                       status:
 *                         type: string
 *                         example: "1"
 *                       createdby:
 *                         type: string
 *                         example: "5L Solutions"
 *                       createddate:
 *                         type: string
 *                         example: "2022-01-01 12:00:00"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /productprice/save:
 *   post:
 *     summary: Save ProductPrice
 *     description: Save ProductPrice
 *     tags:
 *       - productprice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "1"
 *               barcode:
 *                 type: string
 *                 example: "1"
 *               productimage:
 *                 type: string
 *                 example: "1"
 *               price:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: "1"
 *               previousprice:
 *                 type: string
 *                 example: "1"
 *               pricechange:
 *                 type: string
 *                 example: "1"
 *               pricechangedate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               status:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *               createddate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "1"
 *               barcode:
 *                 type: string
 *                 example: "1"
 *               productimage:
 *                 type: string
 *                 example: "1"
 *               price:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: "1"
 *               previousprice:
 *                 type: string
 *                 example: "1"
 *               pricechange:
 *                 type: string
 *                 example: "1"
 *               pricechangedate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               status:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *               createddate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *     responses:
 *       200:
 *         description: ProductPrice saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /productprice/getcategory:
 *   get:
 *     summary: Get ProductPrice Category
 *     description: Get ProductPrice Category
 *     tags:
 *       - productprice
 *     responses:
 *       200:
 *         description: ProductPrice Category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productprice:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productid:
 *                         type: integer
 *                         example: 1
 *                       description:
 *                         type: string
 *                         example: "1"
 *                       barcode:
 *                         type: string
 *                         example: "1"
 *                       price:
 *                         type: string
 *                         example: "1"
 *                       category:
 *                         type: string
 *                         example: "1"
 *                       quantity:
 *                         type: string
 *                         example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 *
 * /product/add-product:
 *   post:
 *     summary: Add Product
 *     description: Add a new product with details
 *     tags:
 *       - product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Product"
 *               productname:
 *                 type: string
 *                 example: "1"
 *               description:
 *                 type: string
 *                 example: "1"
 *               barcode:
 *                 type: string
 *                 example: "1"
 *               productimage:
 *                 type: string
 *                 example: "1"
 *               price:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: "1"
 *               previousprice:
 *                 type: string
 *                 example: "1"
 *               pricechange:
 *                 type: string
 *                 example: "1"
 *               pricechangedate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               status:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *               createddate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Product"
 *               productname:
 *                 type: string
 *                 example: "1"
 *               description:
 *                 type: string
 *                 example: "1"
 *               barcode:
 *                 type: string
 *                 example: "1"
 *               productimage:
 *                 type: string
 *                 example: "1"
 *               price:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: "1"
 *               previousprice:
 *                 type: string
 *                 example: "1"
 *               pricechange:
 *                 type: string
 *                 example: "1"
 *               pricechangedate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               status:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *               createddate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *     responses:
 *       200:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 *
 * /product/edit:
 *   put:
 *     summary: Edit Product
 *     description: Edit a product with details
 *     tags:
 *       - product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: "Product"
 *               productname:
 *                 type: string
 *                 example: "1"
 *               description:
 *                 type: string
 *                 example: "1"
 *               barcode:
 *                 type: string
 *                 example: "1"
 *               productimage:
 *                 type: string
 *                 example: "1"
 *               price:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: "1"
 *               previousprice:
 *                 type: string
 *                 example: "1"
 *               pricechange:
 *                 type: string
 *                 example: "1"
 *               pricechangedate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               status:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *               createddate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: integer
 *                 example: 1
 *               type:
 *                 type: string
 *                 example: "Product"
 *               productname:
 *                 type: string
 *                 example: "1"
 *               description:
 *                 type: string
 *                 example: "1"
 *               barcode:
 *                 type: string
 *                 example: "1"
 *               productimage:
 *                 type: string
 *                 example: "1"
 *               price:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: "1"
 *               previousprice:
 *                 type: string
 *                 example: "1"
 *               pricechange:
 *                 type: string
 *                 example: "1"
 *               pricechangedate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *               status:
 *                 type: string
 *                 example: "1"
 *               createdby:
 *                 type: string
 *                 example: "5L Solutions"
 *               createddate:
 *                 type: string
 *                 example: "2022-01-01 12:00:00"
 *     responses:
 *       200:
 *         description: Product edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 *
 * /productprice/bulk-update:
 *   post:
 *     summary: Bulk Update Product
 *     description: Bulk Update Product
 *     tags:
 *       - product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "1"
 *                     price:
 *                       type: string
 *                       example: "1"
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "1"
 *                     price:
 *                       type: string
 *                       example: "1"
 *     responses:
 *       200:
 *         description: Product edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */