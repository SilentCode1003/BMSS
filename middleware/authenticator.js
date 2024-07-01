const jwt = require("jsonwebtoken");
const SECRET_KEY = "775fYpczFbanSt0ewFeRcH8BZAon89Wk5q0aWD9NzD4=";
const { Decrypter } = require("../routes/repository/cryptography");

const verifyJWT = (req, res, next) => {
  const token = req.session.jwt;
  if (!token) {
    return res.sendStatus(401);
  }

  Decrypter(token, (err, data) => {
    if (err) {
      return res.status(400), res.json({ msg: "error" });
    } else {
      jwt.verify(data, SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = decoded;
        next();
      });
    }
  });
};

module.exports = verifyJWT;
