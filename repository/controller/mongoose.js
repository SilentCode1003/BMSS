const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBSession = require('connect-mongodb-session')(session)
const { CheckConnection } = require('../helper/bmssdb')
require('dotenv').config()

exports.SetMongo = (app) => {
  //mongodb
  mongoose.connect(process.env.MONGODB_URI).then((res) => {
    console.log('MongoDB Connected!')
  })

  const store = new MongoDBSession({
    uri: process.env.MONGODB_URI,
    collection: process.env.MONGODB_COLLECTION,
    expires: 1000 * 60 * 60 * 24,
  })

  //Session
  app.use(
    session({
      secret: '5L Secret Key',
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  )

  //Check SQL Connection
  CheckConnection()
}
