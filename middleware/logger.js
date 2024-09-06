// const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { getNetwork } = require('../routes/repository/customhelper')
const { get } = require('http')

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`
  console.log(message)

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
  } catch (err) {
    console.log('Logging error: ', err)
  }
}

// const logger = (req, res, next) => {
//   getNetwork().then((ipaddress) => {
//     logEvents(`${req.method}\t${req.url}\t${ipaddress}`, 'reqLog.log')
//     next()
//   })
// }

const { createLogger, transports, format } = require('winston');
// const path = require('path');

// Create a Winston logger
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname,'..', 'logs', 'error.log'), level: 'error' })
  ]
});

// // Log an error
// try {
//   throw new Error('A winston-logged error');
// } catch (error) {
//   logger.error(error.message);
// }


module.exports = { logEvents, logger }
