const { query } = require('express')
const { createConnection } = require('mysql2')
const { DecryptString, EncryptString } = require('./cryptography')
require('dotenv').config()

console.log(EncryptString('ebedaf19dd0d'));


const connection = createConnection({
  host: process.env._HOST,
  user: process.env._USER,
  password: DecryptString(process.env._PASSWORD),
  database: process.env._DATABASE,
})

exports.CheckConnectionNew = () => {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.log('Error connecting to the database:', err)
        reject(err)
      } else {
        console.log('Connected to the database!')
        resolve(true)
      }
    })
  })
}

exports.Select = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, result) => {
      if (err) {
        console.log('Error running query:', err)
        reject(err)
      } else {
        // console.log("Query executed successfully:", result);
        resolve(result)
      }
    })
  })
}

exports.Update = (query, data) => {
  return new Promise((resolve, reject) => {
    connection.query(query, data, (err, result) => {
      if (err) {
        console.log('Error running query:', err)
        reject(err)
      } else {
        // console.log("Query executed successfully:", result);
        resolve(result.affectedRows)
      }
    })
  })
}

exports.Insert = (query, data) => {
  return new Promise((resolve, reject) => {
    connection.query(query, [data], (err, result) => {
      if (err) {
        console.log('Error running query:', err)
        reject(err)
      } else {
        // console.log("Query executed successfully:", result);
        resolve([{ rows: result.affectedRows, id: result.insertId }])
      }
    })
  })
}

exports.Delete = (query, data) => {
  return new Promise((resolve, reject) => {
    connection.query(query, data, (err, result) => {
      if (err) {
        console.log('Error running query:', err)
        reject(err)
      } else {
        // console.log("Query executed successfully:", result);
        resolve(result.affectedRows)
      }
    })
  })
}

exports.SelectWithCondition = (query, condition) => {
  return new Promise((resolve, reject) => {
    connection.query(query, condition, (err, result) => {
      if (err) {
        console.log('Error running query:', err)
        reject(err)
      } else {
        // console.log("Query executed successfully:", result);
        resolve(result)
      }
    })
  })
}
