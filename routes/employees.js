var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const currentDate = new Date().toISOString().split('T')[0];
    res.render('employees', { currentDate });
});

module.exports = router;
