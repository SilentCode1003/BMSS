var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthUser, function (req, res, next) {
  res.render('index', {
    positiontype: req.session.positiontype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
    employeeid: req.session.employeeid,
    branchid: req.session.branchid,
  });
});

function isAuthUser(req, res, next) {

  if (req.session.positiontype == "User" || req.session.positiontype == "Admin" || req.session.positiontype == "Developer" || req.session.positiontype == "Manager") {
      next();
  }
  else {
      res.redirect('/login');
  }
};

module.exports = router;
