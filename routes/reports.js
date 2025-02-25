var express = require("express");
var router = express.Router();

const { SelectStatement } = require('../repository/helper/customhelper')
const { SelectAll, Query, Transaction, Check } = require('../repository/utility/query.util')
const mysql = require('../repository/helper/bmssdb')
const helper = require('../repository/helper/customhelper')
const dictionary = require('../repository/helper/dictionary')
const { Validator } = require('../repository/controller/middleware')

/* GET home page. */

router.get("/", function (req, res, next) {
  Validator(req, res, "reports");
});

module.exports = router;
