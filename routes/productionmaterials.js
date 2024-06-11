const express = require("express");
const router = express.Router();

const mysql = require("./repository/bmssdb");
const helper = require("./repository/customhelper");
const dictionary = require("./repository/dictionary");
const { Validator } = require("./controller/middleware");
const { DataModeling } = require("./model/bmssmodel");
const converter = require("convert-units");
const { convert } = require("./repository/customhelper");

/* GET home page. */
router.get("/", function (req, res, next) {
  Validator(req, res, "productionmaterials");
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let sql = `SELECT mpm_productid AS productid, mpm_productname AS productname, mpm_description AS description, mc_categoryname AS category, mv_vendorname AS vendorid, mpm_price AS price, mpm_status AS status, mpm_createdby AS createdby, mpm_createddate AS createddate, pmc_unit AS unit
    FROM production_materials
    INNER JOIN master_vendor ON mv_vendorid = mpm_vendorid
    INNER JOIN master_category ON mc_categorycode = mpm_category
    INNER JOIN production_material_count ON pmc_countid = mpm_productid
    ORDER BY mpm_productname;`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }

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

router.get("/load/:vendorid", (req, res) => {
  try {
    const vendorid = req.params.vendorid;

    let sql = `SELECT mpm_productid AS productid, mpm_productname AS productname, mpm_description AS description, mc_categoryname AS category, mv_vendorname AS vendorid, mpm_price AS price, mpm_status AS status, mpm_createdby AS createdby, mpm_createddate AS createddate, pmc_unit AS unit
    FROM production_materials
    INNER JOIN master_vendor ON mv_vendorid = mpm_vendorid
    INNER JOIN master_category ON mc_categorycode = mpm_category
    INNER JOIN production_material_count ON pmc_countid = mpm_productid
    
    WHERE mpm_vendorid = '${vendorid}'
    ORDER BY mpm_productname;`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          msg: err,
        });
      }

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

router.post("/save", (req, res) => {
  try {
    let productname = req.body.productname;
    let description = req.body.description;
    let category = req.body.category;
    let vendorid = req.body.vendorid;
    let price = req.body.price;
    let unit = req.body.unit;

    let createdby = req.session.fullname;
    let status = dictionary.GetValue(dictionary.ACT());
    let createddate = helper.GetCurrentDatetime();
    let quantity = 0;
    let data = [];
    let rowData = [];

    let sql_check = `select * from production_materials where mpm_productname ='${productname}'`;

    function addmaterialrecord(productid) {
      rowData.push([productid, quantity, unit, status, createdby, createddate]);
      console.log(rowData);
      mysql.InsertTable("production_material_count", rowData, (err, result) => {
        if (err) {
          console.error("Error: ", err);
        }
        res.json({
          msg: "success",
          data: result,
        });
      });
    }

    mysql.Select(sql_check, "ProductionMaterials", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "exist",
        });
      } else {
        data.push([
          productname,
          description,
          category,
          vendorid,
          price,
          status,
          createdby,
          createddate,
        ]);

        mysql.InsertTable("production_materials", data, (err, result) => {
          if (err) console.error("Error: ", err);

          let productid = result[0]["id"];
          addmaterialrecord(productid);
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/status", (req, res) => {
  try {
    let productid = req.body.productid;
    let status =
      req.body.status == dictionary.GetValue(dictionary.ACT())
        ? dictionary.GetValue(dictionary.INACT())
        : dictionary.GetValue(dictionary.ACT());
    let data = [status, productid];
    console.log(data);

    let sql_Update = `UPDATE production_materials SET mpm_status = ? WHERE mpm_productid = ?`;

    mysql.UpdateMultiple(sql_Update, data, (err, result) => {
      if (err) console.error("Error: ", err);

      res.json({
        msg: "success",
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.patch("/edit", (req, res) => {
  try {
    const {
      productid,
      productname,
      description,
      category,
      vendorid,
      price,
      unit,
    } = req.body;

    let data = [];

    if (unit) {
      UpdateUnit(productid, unit)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log("Error: ", err);
          res.status(500), res.json({ msg: "Bad Request" });
        });
    }
    if (productname || description || category || vendorid || price) {
      let sql_Update = `UPDATE production_materials SET`;

      if (productname) {
        sql_Update += ` mpm_productname = ?,`;
        data.push(productname);
      }

      if (description) {
        sql_Update += ` mpm_description = ?,`;
        data.push(description);
      }

      if (category) {
        sql_Update += ` mpm_category = ?,`;
        data.push(category);
      }

      if (vendorid) {
        sql_Update += ` mpm_vendorid = ?,`;
        data.push(vendorid);
      }

      if (price) {
        sql_Update += ` mpm_price = ?,`;
        data.push(price);

        CostUpdate(productid, price)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(404);
          });
      }

      sql_Update = sql_Update.slice(0, -1);
      sql_Update += ` WHERE mpm_productid = ?;`;
      data.push(productid);

      let sql_check = `SELECT * FROM production_materials WHERE mpm_productid = '${productid}'`;

      mysql.Select(sql_check, "ProductionMaterials", (err, result) => {
        if (err) {
          console.error("Error: ", err);
          return res.json({
            msg: "error",
          });
        }

        if (result.length !== 1) {
          return res.json({
            msg: "notexist",
          });
        } else {
          console.log(sql_Update, data);
          mysql.UpdateMultiple(sql_Update, data, (err, result) => {
            if (err) {
              console.error("Error: ", err);
              return res.json({
                msg: "error",
              });
            }

            res.json({
              msg: "success",
            });
          });
        }
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      msg: "error",
    });
  }
});

router.get("/active", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let sql = `select * from production_materials where ml_status='${status}'`;

    mysql.Select(sql, "ProductionMaterials", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      console.log(helper.GetCurrentDatetime());

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

router.post("/getmaterials", (req, res) => {
  try {
    let materialid = req.body.materialid;
    // console.log(materialid);
    let data = [];
    let sql = `SELECT mpm_price as price, pmc_unit as unit, mpm_productname as materialname, mpm_productid as productid
              FROM production_materials
              INNER JOIN production_material_count
              ON production_materials.mpm_productid = production_material_count.pmc_productid 
              WHERE mpm_productid = '${materialid}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        // console.log(result)
        return res.json({
          msg: err,
        });
      }
      result.forEach((key, item) => {
        data.push({
          price: key.price,
          unit: key.unit,
          materialname: key.materialname,
          productid: key.productid,
        });
      });
      //console.log(data)
      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getByID", (req, res) => {
  try {
    let id = req.body.id;
    // console.log(materialname);
    let data = [];
    let sql = `SELECT mpm_price as price, pmc_unit as unit, mpm_productname as materialname, mpm_productid as productid
              FROM production_materials
              INNER JOIN production_material_count
              ON production_materials.mpm_productid = production_material_count.pmc_productid 
              WHERE mpm_productid = '${id}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) {
        // console.log(result)
        return res.json({
          msg: err,
        });
      }
      result.forEach((key, item) => {
        data.push({
          price: key.price,
          unit: key.unit,
          materialname: key.materialname,
          productid: key.productid,
        });
      });
      //console.log(data)
      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/conversion", (req, res) => {
  try {
    const { newUnit, currUnit, quantity } = req.body;

    const mass = {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      mcg: 0.000000001,
      oz: 0.0295735,
      lb: 0.453592,
      mt: 1000,
      t: 1000,
    };

    const volume = {
      ml: 0.001,
      l: 1,
      kl: 1000,
      gal: 3.78541,
    };

    let convertedQuantity;

    if (mass[currUnit] !== undefined && volume[newUnit] !== undefined) {
      convertedQuantity = (quantity * mass[currUnit]) / volume[newUnit];
      console.log("Volume to Mass Conversion:", convertedQuantity);
    } else if (volume[currUnit] !== undefined && mass[newUnit] !== undefined) {
      convertedQuantity = (quantity * volume[currUnit]) / mass[newUnit];
      console.log("Mass to Volume Conversion:", convertedQuantity);
    } else {
      convertedQuantity = converter(quantity).from(currUnit).to(newUnit);
      console.log("Standard Conversion used!");
    }

    console.log(`${currUnit} to ${newUnit}: `, convertedQuantity);
    res.json({ data: convertedQuantity, from: currUnit, to: newUnit });
  } catch (err) {
    res.status(400), res.json({ msg: "error" });
  }
});

//#region Update Unit
UpdateUnit = (id, newUnit) => {
  const mass = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    mcg: 0.000000001,
    oz: 0.0295735,
    lb: 0.453592,
    mt: 1000,
    t: 1000,
  };

  const volume = {
    ml: 0.001,
    l: 1,
    kl: 1000,
    gal: 3.78541,
  };

  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM production_material_count WHERE pmc_countid = '${id}'`;

    mysql.SelectResult(query, (err, result) => {
      if (err) reject(err);

      const details = DataModeling(result, "pmc_");
      const { productid, quantity, unit } = details[0];

      try {
        let convertedQuantity;

        if (mass[unit] !== undefined && volume[newUnit] !== undefined) {
          convertedQuantity = (quantity * mass[unit]) / volume[newUnit];
          console.log("Volume to Mass Conversion:", convertedQuantity);
        } else if (volume[unit] !== undefined && mass[newUnit] !== undefined) {
          convertedQuantity = (quantity * volume[unit]) / mass[newUnit];
          console.log("Mass to Volume Conversion:", convertedQuantity);
        } else {
          convertedQuantity = converter(quantity).from(unit).to(newUnit);
          console.log("Standard Conversion used!");
        }

        // console.log(`${unit} to ${newUnit}: `, convertedQuantity.toFixed(2));

        const updateQuery = helper.UpdateStatement(
          "production_material_count",
          "pmc",
          ["unit", "quantity"],
          ["productid"]
        );

        const data = [newUnit, convertedQuantity, id];

        mysql.UpdateMultiple(updateQuery, data, (err, result) => {
          if (err) reject(err);
        });

        // console.log(updateQuery, data);

        resolve(details[0]);
      } catch (conversionError) {
        reject(conversionError);
      }
    });
  });
};
//#endregion

//#region Update Component Cost
CostUpdate = (materialid, cost) => {
  return new Promise((resolve, reject) => {
    const components = `SELECT pc_productid AS productId, pc_components as components FROM product_component`;

    mysql.SelectResult(components, (err, result) => {
      if (err) reject(err);
      let data = result;
      // console.log(result);
      const updatedData = [];

      data.forEach((product) => {
        let components = JSON.parse(product.components);
        let updated = false;

        components.forEach((component) => {
          if (parseInt(component.materialid) === parseInt(materialid)) {
            const { quantity, unit, unitdeduction } = component;
            const ratio = convert(unit, unitdeduction);
            const newQuantity = quantity * ratio;
            const newCost = newQuantity * cost;

            component.cost = newCost;
            updated = true;
          }
        });

        if (updated) {
          updatedData.push({
            productId: product.productId,
            components: JSON.stringify(components),
          });
        }
      });

      console.log(updatedData);
      updatedData.forEach((row) => {
        const { productId, components } = row;

        const updateStatement = helper.UpdateStatement(
          "product_component",
          "pc",
          ["components"],
          ["productid"]
        );

        const updatedData = [components, productId];
        console.log(updateStatement, updatedData);

        mysql.UpdateMultiple(updateStatement, updatedData, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log("Component Updated:", productId);
        });
      });
      resolve(updatedData);
    });
  });
};
//#endregion
