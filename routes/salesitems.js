var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isAuthUser, function(req, res, next) {
    res.render('salesitems',{
        fullname: req.session.fullname,
        positiontype: req.session.positiontype,
        accesstype: req.session.accesstype,
      });
    });
    
    function isAuthUser(req, res, next) {
    
      if (req.session.positiontype == "User" || req.session.positiontype == "Admin" || req.session.positiontype == "Developer" ) {
          next();
      }
      else {
          res.redirect('/login');
      }
    };

module.exports = router;
