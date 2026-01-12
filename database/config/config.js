const { DecryptString } = require("../../repository/helper/cryptography");

require("dotenv").config();

module.exports = {
  development: {
    username: process.env._USER,
    password: DecryptString(process.env._PASSWORD),
    database: process.env._DATABASE,
    host: process.env._HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env._USER,
    password: DecryptString(process.env._PASSWORD),
    database: process.env._DATABASE,
    host: process.env._HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env._USER,
    password: DecryptString(process.env._PASSWORD),
    database: process.env._DATABASE,
    host: process.env._HOST,
    dialect: "mysql",
  },
};
