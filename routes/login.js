var express = require('express');
var router = express.Router();

const mysql = require('./repository/bmssdb');
const helper = require('./repository/customhelper');
const dictionary = require('./repository/dictionary');
const crypto = require('./repository/cryptography');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', {
    roletype: req.session.roletype,
    accesstype: req.session.accesstype,
    username: req.session.username,
    fullname: req.session.fullname,
  });
}); 

module.exports = router;

router.post('/authentication', (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;

    crypto.Encrypter(password, (err, encryptedpass) => {
      if (err) {
        console.error('Encryption Error: ', err);
      }
      console.log(encryptedpass);

      // console.log(USERNAME: ${username})
      
      let sql = `SELECT * FROM master_employees inner join master_user on me_employeeid = mu_employeeid where mu_password='${encryptedpass}' and mu_username='${username}'`;
      mysql.SelectResult(sql, (err, result) => {
        if (err) {
          return res.json
            ({
              msg: err
            })
        }
        console.log(result)
        if (result.length != 0) {
            req.session.isAuth = true;
            req.session.username = result[0].mu_username;
            req.session.positiontype = result[0].mu_positiontype;
            req.session.fullname = result[0].me_fullname;
            req.session.accesstype = result[0].mu_accesstype;
            console.log(result[0].me_fullname)
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

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {

      res.json({
        msg: err
      });

    }
    res.json({
      msg: "success"
    })
  });

});
