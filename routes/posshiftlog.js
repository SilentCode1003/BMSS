var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "posshiftlog");
});

module.exports = router;

router.post("/getposshift", (req, res) => {
  try {
    let posid = req.body.posid;
    let status = dictionary.GetValue(dictionary.STR());
    let sql = `select * from pos_shift_logs where psl_posid='${posid}' and psl_status='${status}'`;

    mysql.Select(sql, "POSShiftLogs", (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);
      res.json({
        msg: "success",
        data: result,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/startshift", (req, res) => {
  try {
    let startdate = helper.GetCurrentDate();
    let closed_status = dictionary.GetValue(dictionary.CLD());
    let start_status = dictionary.GetValue(dictionary.STR());
    let cashier = req.body.cashier;
    let posid = req.body.posid;
    let receiptbeginning = req.body.receiptbeginning;
    let sql_check = `select count(*) as count from pos_shift_logs where psl_posid='${posid}' and psl_status='${closed_status}' and psl_date='${startdate}'`;
    let shift_report = [];
    let insert_shift_report = `INSERT INTO shift_report(
      sr_date,
      sr_pos,
      sr_shift,
      sr_cashier,
      sr_sales_beginning,
      sr_status,
      sr_receipt_beginning) VALUES ?`;

    mysql.SelectResult(sql_check, (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result[0].count != 0) {
        console.log("with result");
        let data = [];
        let shift = parseInt(result[0].count) + 1;
        data.push([posid, startdate, shift, start_status]);

        console.log(data);

        GetPreviousSales(posid, startdate, shift - 1)
          .then((result) => {
            let salesbeginning = parseFloat(result[0].salesending);

            shift_report.push([
              startdate,
              posid,
              shift,
              cashier,
              salesbeginning,
              start_status,
              receiptbeginning,
            ]);

            console.log(shift_report);

            InsertPOSShiftLog(data)
              .then((result) => {
                console.log(result);

                mysql.Insert(
                  insert_shift_report,
                  shift_report,
                  (err, result) => {
                    if (err) console.error("Error: ", err);

                    console.log(result);

                    res.json({
                      msg: "success",
                    });
                  }
                );
              })
              .catch((error) => {
                return res.json({
                  msg: error,
                });
              });
          })
          .catch((error) => {
            return res.json({
              msg: error,
            });
          });
      } else {
        let data = [];
        let shift = "1";
        data.push([posid, startdate, shift, start_status]);

        console.log("no result");

        CheckPOSShiftlog(posid, closed_status)
          .then((result) => {
            console.log(result);

            if (result.length != 0) {
              let date = result[0].date;
              let shiftlog = result[0].shift;

              GetPreviousSales(posid, date, shiftlog)
                .then((result) => {
                  console.log(result);

                  shift_report.push([
                    startdate,
                    posid,
                    shift,
                    cashier,
                    result[0].salesending,
                    start_status,
                    receiptbeginning,
                  ]);

                  InsertPOSShiftLog(data)
                    .then((result) => {
                      console.log(result);

                      mysql.Insert(
                        insert_shift_report,
                        shift_report,
                        (err, result) => {
                          if (err) console.error("Error: ", err);

                          console.log(result);

                          res.json({
                            msg: "success",
                          });
                        }
                      );
                    })
                    .catch((error) => {
                      return res.json({
                        msg: error,
                      });
                    });
                })
                .catch((error) => {
                  return res.json({
                    msg: error,
                  });
                });
            } else {
              GetPreviousSales(posid, startdate, shift)
                .then((previoussales) => {
                  console.log(previoussales);

                  if (previoussales.length != 0) {
                    previoussales == null ? 0 : previoussales[0].salesending;
                    shift_report.push([
                      startdate,
                      posid,
                      shift,
                      cashier,
                      previoussales,
                      start_status,
                      receiptbeginning,
                    ]);
                  } else {
                    InsertPOSShiftLog(data)
                      .then((result) => {
                        console.log(result);

                        shift_report.push([
                          startdate,
                          posid,
                          shift,
                          cashier,
                          0,
                          start_status,
                          receiptbeginning,
                        ]);

                        mysql.Insert(
                          insert_shift_report,
                          shift_report,
                          (err, result) => {
                            if (err) console.error("Error: ", err);

                            console.log(result);

                            res.json({
                              msg: "success",
                            });
                          }
                        );
                      })
                      .catch((error) => {
                        return res.json({
                          msg: error,
                        });
                      });
                  }
                })
                .catch((error) => {
                  return res.json({
                    msg: error,
                  });
                });
            }
          })
          .catch((error) => {
            return res.json({
              msg: error,
            });
          });

        // mysql.SelectResult(pos_shift_log_check, (err, result) => {
        //   if (err) console.error("Error: ", err);

        //   console.log(result);

        //   if (result.length != 0) {
        //     let date = result.date;
        //     let shiftlog = result.shift;

        //     let initial_shift_report = `select sr_total_sales as totalsales from shift_report where
        //   sr_date='${date}'
        //   and sr_pos='${posid}'
        //   and sr_shift='${shiftlog}'`;

        //     mysql.SelectResult(initial_shift_report, (err, result) => {
        //       if (err) console.error("Error: ", err);

        //       console.log(result);
        //       let salesbeginning =
        //         parseFloat(result[0].totalsales) == "Nan"
        //           ? 0
        //           : result[0].totalsales;

        //       data.push([posid, startdate, shift, start_status]);
        //       shift_report.push([
        //         startdate,
        //         posid,
        //         shift,
        //         cashier,
        //         salesbeginning,
        //         start_status,
        //       ]);

        //       mysql.InsertTable("pos_shift_logs", data, (err, result) => {
        //         if (err) console.error("Error: ", err);

        //         console.log(result);

        //         mysql.Insert(
        //           insert_shift_report,
        //           shift_report,
        //           (err, result) => {
        //             if (err) console.error("Error: ", err);

        //             console.log(result);

        //             res.json({
        //               msg: "success",
        //             });
        //           }
        //         );
        //       });
        //     });
        //   } else {
        //   }
        // });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/endshift", (req, res) => {
  try {
    let posid = req.body.posid;
    let receiptending = req.body.receiptending;
    let status = dictionary.GetValue(dictionary.STR());
    let sql = `select * from pos_shift_logs where psl_posid ='${posid}' and psl_status='${status}'`;

    mysql.Select(sql, "POSShiftLogs", (err, result) => {
      if (err) console.error("Error: ", err);

      console.log(result);

      if (result.length != 0) {
        let startdate = result[0].date;
        let shift = result[0].shift;

        let updatestatus = dictionary.GetValue(dictionary.CLD());
        let data = [updatestatus, posid, startdate];
        let sql_update =
          "update pos_shift_logs set psl_status=? where psl_posid =? and psl_date=?";
        let shift_sales_details = `select 
        st_pos_id as posid,
        st_shift as shift,
        sum(cast(st_total as decimal(10,2))) as total 
        from sales_detail 
        where st_date between '${startdate} 00:00' and '${helper.GetCurrentDate()} 23:59' 
        and st_pos_id = '${posid}'
        and st_shift = '${shift}'`;

        mysql.SelectResult(shift_sales_details, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
          let total = result[0].total == null ? 0 : result[0].total;

          let sales_ending_shift_report = `select (sr_sales_beginning + ${total}) as salesending 
          from shift_report where 
          sr_date='${startdate}' 
          and sr_pos='${posid}' 
          and sr_shift='${shift}'`;

          mysql.SelectResult(sales_ending_shift_report, (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);
            let salesending = result[0].salesending;
            let shift_report = [
              total,
              salesending,
              updatestatus,
              receiptending,
              posid,
              startdate,
              shift,
            ];

            let update_shift_report =
              "update shift_report set sr_total_sales=?, sr_sales_ending=?, sr_status=?, sr_receipt_ending=? where sr_pos =? and sr_date=? and sr_shift=?";

            mysql.UpdateMultiple(
              update_shift_report,
              shift_report,
              (err, result) => {
                if (err) console.error("Error: ", err);
                console.log(result);
              }
            );
          });
        });

        mysql.UpdateMultiple(sql_update, data, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        });
      } else {
        res.json({
          msg: "No Shift Found",
        });
      }
    });
  } catch (error) {
    res.json({ msg: error.message });
  }
});

function CheckPOSShiftlog(posid, status) {
  return new Promise((resolve, reject) => {
    let pos_shift_log_check = `select psl_posid as posid,
    psl_date as date,
    psl_shift as shift,
    psl_status as status
    from pos_shift_logs 
    where psl_posid='${posid}' 
    and psl_status='${status}' 
    order by psl_date desc, 
    psl_shift desc limit 1`;

    mysql.SelectResult(pos_shift_log_check, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}

function GetPreviousSales(posid, date, shift) {
  return new Promise((resolve, reject) => {
    let initial_shift_report = `select sr_sales_ending as salesending from shift_report where 
    sr_date='${date}' 
    and sr_pos='${posid}' 
    and sr_shift='${shift}'`;

    mysql.SelectResult(initial_shift_report, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}

function InsertPOSShiftLog(data) {
  return new Promise((resolve, reject) => {
    mysql.InsertTable("pos_shift_logs", data, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      console.log(result);
      resolve(result);
    });
  });
}
