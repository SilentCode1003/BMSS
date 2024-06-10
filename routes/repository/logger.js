const helper = require("./customhelper");
const mysql = require("./bmssdb");
const dictionary = require("./dictionary");

exports.Logger = (level, source, message, user) => {
  let logdata = [];
  let logdate = helper.GetCurrentDatetime();
  let loglevel = dictionary.GetValue(level);
  let logsource = dictionary.GetValue(source);

  helper
    .getNetwork()
    .then((ipaddress) => {
      logdata.push([logdate, loglevel, logsource, message, user, ipaddress]);
      mysql.InsertTable("system_logs", logdata, (err, result) => {
        if (err) console.error("Error: ", err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
