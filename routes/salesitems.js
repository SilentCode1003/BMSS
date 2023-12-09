var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
    Validator(req, res, "productprice");
});
module.exports = router;




