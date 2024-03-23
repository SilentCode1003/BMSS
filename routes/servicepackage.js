var express = require("express");
var router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Logger } = require("./repository/logger");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");
const { parse } = require("dotenv");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "servicepackage");
});
module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = "select * from package";

    mysql.Selects(sql, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ msg: err });
      }

      if (result.length != 0) {
        let data = DataModeling(result, "p_");
        res.json({ msg: "success", data: data });
      } else {
        res.json({
          msg: "success",
          data: result,
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/save", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby =
      req.session.fullname == null ? "DEV42" : req.session.fullname;
    let createddate = helper.GetCurrentDatetime();
    const { packagedata, name, price } = req.body;
    let details = JSON.parse(packagedata);

    let sql = helper.InsertStatement("package", "p", [
      "details",
      "name",
      "price",
      "status",
      "createdby",
      "createddate",
    ]);
    let data = [[details, name, price, status, createdby, createddate]];
    let checkStatement = helper.SelectStatement(
      `select * from package where p_name = ?
            and p_price = ?`,
      [name, price]
    );

    Check(checkStatement)
      .then((result) => {
        console.log(result);
        if (result != 0) {
          return res.json({
            msg: "exist",
          });
        } else {
          mysql.Insert(sql, data, (err, result) => {
            if (err) {
              console.log(err);
              res.json({ msg: err });
            }

            console.log(result);

            res.json({ msg: "success" });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({ msg: error });
      });
  } catch (error) {
    console.log(err);
    res.json({ msg: err });
  }
});

router.put("/status", (req, res) => {
  try {
    let id = req.body.id;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, id];

    let updateStatement = helper.UpdateStatement(
      "package",
      "p",
      ["status"],
      ["id"]
    );

    console.log(updateStatement, data);

    mysql.UpdateMultiple(updateStatement, data, (err, result) => {
      if (err) console.error("Error: ", err);

      res.json({ msg: "success" });
    });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
});

router.put("/edit", (req, res) => {
  try {
    const { name, price, id } = req.body;

    console.log(name, price, id);

    let data = [];
    let columns = [];
    let arguments = [];

    if (name) {
      data.push(name);
      columns.push("name");
    }

    if (price) {
      data.push(price);
      columns.push("price");
    }

    if (id) {
      data.push(id);
      arguments.push("id");
    }

    let updateStatement = helper.UpdateStatement(
      "package",
      "p",
      columns,
      arguments
    );

    let checkStatement = helper.SelectStatement(
      `select * from package where p_name = ?`,
      [name]
    );

    Check(checkStatement)
      .then((result) => {
        if (result != 0) {
          return res.json({ msg: "exist" });
        } else {
          mysql.UpdateMultiple(updateStatement, data, (err, result) => {
            if (err) console.error("Error: ", err);

            console.log(result);

            res.json({
              msg: "success",
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.json({ msg: error });
      });
  } catch (error) {
    console.log(error);
    res.json({ msg: error });
  }
});

router.post("/getactive", (req, res) => {
  try {
    let status = req.body.status;

    let sql = `select * from package where p_status = '${status}'`;
    let package = [];

    mysql.Selects(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ msg: err });
      }
      if (result != 0) {
        let data = DataModeling(result, "p_");

        // data.forEach((item) => {
        //   let details = JSON.parse(item.details);
        //   let components = [];

        //   details.forEach((detail) => {
        //     console.log(detail.productname);
        //     let select_product = helper.SelectStatement(
        //       "select * from master_product where mp_description=?",
        //       [detail.productname]
        //     );
        //     let check_statement = helper.SelectStatement(
        //       "select pi_quantity as count from product_inventory where pi_productid=? and pi_branchid=?",
        //       []
        //     );

        //     mysql.Selects(check_statement);

        //     components.push({
        //       name: detail.productname,
        //       branch: detail.branchid,
        //       price: detail.price,
        //       quantity: detail.quantity,
        //     });
        //   });

        //   package.push({
        //     package: item.name,
        //     components: JSON.stringify(components),
        //   });
        // });

        // console.log(package);

        res.json({ msg: "success", data: data });
      } else {
        res.json({ msg: "success", data: result });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

//#region FUNCTION
function Check(sql) {
  return new Promise((resolve, reject) => {
    mysql.Selects(sql, (err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}
//#endregion
