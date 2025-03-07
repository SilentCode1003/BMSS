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

/**
 * @swagger
 * /mobile-api/getproductreport:
 *   post:
 *     tags:
 *       - mobile-api
 *     summary: Get Product Report
 *     description: Get Product Report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchid:
 *                 type: string
 *                 description: Branch ID
 *               posid:
 *                 type: string
 *                 description: POS ID
 *               shiftdate:
 *                 type: string
 *                 description: Shift Date
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Date
 *                       quantity:
 *                         type: string
 *                         description: POS ID
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message
 *                 error:
 *                   type: string
 *                   description: Error
 *
 *
 */
