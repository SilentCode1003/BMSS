const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
require('dotenv').config()

//#region Swagger
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

const specs = swaggerJSDoc(swaggerOptions)
//#endregion