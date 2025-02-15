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

//#region Denomination
/**
 * @swagger
 * /denomination/getdenomination:
 *    get:
 *      tags:
 *        - Denomination
 *      summary: Get all the denomination
 *      description: Get all the denomination
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        md_id:
 *                          type: integer
 *                        md_code:
 *                          type: string
 *                        md_description:
 *                          type: string
 *                        md_value:
 *                          type: number
 *                        md_status:
 *                          type: string
 *                        md_create_by:
 *                          type: string
 *                        md_create_date:
 *                          type: string
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        message:
 *                          type: string
 *                          example: Internal Server Error
 *
 */

//#endregion
