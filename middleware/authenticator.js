const jwt = require('jsonwebtoken')
const { Decrypter, DecryptString } = require('../routes/repository/cryptography')

const verifyJWT = (req, res, next) => {
  const token = req.session.jwt ?? req.body.APK
  // console.log('Session', req.session.jwt, 'Body', req.body.token)
  // console.log(token)

  if (!token) {
    return res.sendStatus(401)
  }

  Decrypter(token, (err, data) => {
    if (err) {
      console.log('Decryption Error', err)
      return res.status(400), res.json({ msg: err })
    } else {
      jwt.verify(data, process.env._SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log('JWT Error', err)
          return res.sendStatus(403)
        }
        req.user = decoded
        next()
      })
    }
  })
}

module.exports = verifyJWT
