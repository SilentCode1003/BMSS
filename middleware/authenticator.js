const jwt = require('jsonwebtoken')
const {logger} = require('../middleware/logger')
const { Decrypter } = require('../repository/helper/cryptography')
const { UnauthorizedTemplate, SessionExpiredTemplate } = require('../repository/helper/customhelper')

const verifyJWT = (req, res, next) => {
  let token = req.session.jwt ?? req.body.APK ?? req.params.APK ?? req.headers['authorization'].split('Bearer ')[1]

  // console.log('Session', req.session.jwt, 'Body', req.body.token)
  // console.log(token)

  if (!token) {
    logger.info('INF', 'Login', 'Unauthorized Access', 'unknown')
    return res.status(401).send(SessionExpiredTemplate())
  }

  Decrypter(token, (err, data) => {
    if (err) {
      // console.log('Decryption Error', err)
      return res.status(400).send(UnauthorizedTemplate())
    } else {
      jwt.verify(data, process.env._SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log('JWT Error', err)
          logger.info('INF', 'Login', 'Unauthorized Access', 'unknown')
          return res.status(403).send(UnauthorizedTemplate())
        }

        req.user = decoded
        next()
      })
    }
  })
}

module.exports = verifyJWT
