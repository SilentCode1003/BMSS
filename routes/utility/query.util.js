const mysql = require('mysql2/promise')
require('dotenv').config()
const { Decrypter } = require('../repository/cryptography')

Decrypter(process.env._PASSWORD, async (err, result) => {
  if (err) throw err
  const password = result

  const pool = mysql.createPool({
    host: process.env._HOST,
    user: process.env._USER,
    password: password,
    database: process.env._DATABASE,
    multipleStatements: true,
  })

  exports.Query = async (sql, params = []) => {
    try {
      const [result] = await pool.query(sql, params)
      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        return { ...result, insertId: result.insertId }
      }
      return result
    } catch (error) {
      console.error('Error executing query:', error)
      throw error
    }
  }

  exports.Transaction = async (queries) => {
    let connection
    try {
      connection = await pool.getConnection()
      await connection.beginTransaction()

      const queryPromises = queries.map((query) => {
        return connection.execute(query.sql, query.values)
      })

      await Promise.all(queryPromises)
      await connection.commit()
      console.log('Transaction successfully committed.')
    } catch (error) {
      if (connection) {
        await connection.rollback()
      }
      console.error('Error executing transaction:', error)
      throw error
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }
})
