var express = require('express')
var router = express.Router()

router.get('/alive', function (req, res, next) {
  res.status(200).json({
    msg: 'Keep A;live',
  })
})

module.exports = router
