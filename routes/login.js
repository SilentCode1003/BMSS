var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const crypto = require('./repository/cryptography');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;

router.post('/authentication', (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    var message = "";

    crypto.Encrypter(password, (err, result) => {
      if (err) {
        console.error('Encryption Error: ', err);
      }
      console.log(result);

      // console.log(USERNAME: ${username})
      let sql = `select * from master_user where mu_username='${username}' and mu_password='${result}'`;
      mysql.Select(sql, 'MasterUser', (err, result) => {
        if (err) {
          return res.json
            ({
              msg: err
            })
        }
        console.log(result);
        if (result.length != 0) {
            //req.session.isAuth = true;
            //req.session.username = result[0].username;
            //req.session.fullname = result[0].fullname;
            //req.session.positiontype = result[0].positiontype;
            //req.session.accesstype = result[0].accesstype;

          res.json({
            msg: 'success',
          }).next;
        }
        else {
          return res.json
            ({
              msg: 'incorrect'
            })
        }

      })
    })

  } catch (error) {
    res, json({
      msg: error
    })
  }
});
