const mysql = require("mysql");
const model = require("../model/bmssmodel");
require("dotenv").config();
const crypt = require("./cryptography");

let password = "";
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
  if (err) throw err;

  password = result;
  console.log(`${result}`);
});

const connection = mysql.createConnection({
  host: process.env._HOST,
  user: process.env._USER,
  password: password,
  database: process.env._DATABASE,
});

crypt.Encrypter("#Ebedaf19dd0d", (err, result) => {
  if (err) console.error("Error: ", err);

  console.log(result);
});

// crypt.Decrypter('f6a3287039d0d75cb83cb29d35b3dfcb', (err, result) => {
//     if (err) console.error('Error: ', err);

//     console.log(${result});
// });

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connection to MYSQL databases: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connection to MYSQL databases: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};

exports.InsertMultiple = async (stmt, todos) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row inserted: ${results.affectedRows}`);

      return 1;
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Select = (sql, table, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      if (table == "MasterAccessType") {
        callback(null, model.MasterAccessType(results));
      }

      if (table == "MasterPositionType") {
        callback(null, model.MasterPositionType(results));
      }

      if (table == "MasterUser") {
        callback(null, model.MasterUser(results));
      }

      if (table == "MasterEmployees") {
        callback(null, model.MasterEmployees(results));
      }

      if (table == "MasterProduct") {
        callback(null, model.MasterProduct(results));
      }

      if (table == "MasterCategory") {
        callback(null, model.MasterCategory(results));
      }

      if (table == "MasterPos") {
        callback(null, model.MasterPos(results));
      }

      if (table == "MasterBranch") {
        callback(null, model.MasterBranch(results));
      }

      if (table == "MasterVendor") {
        callback(null, model.MasterVendor(results));
      }

      if (table == "MasterLocation") {
        callback(null, model.MasterLocation(results));
      }

      if (table == "MasterMaterialCost") {
        callback(null, model.MasterMaterialCost(results));
      }

      if (table == "SalesDetail") {
        callback(null, model.SalesDetail(results));
      }

      if (table == "SalesItem") {
        callback(null, model.SalesItem(results));
      }

      if (table == "ShiftReport") {
        callback(null, model.ShiftReport(results));
      }

      if (table == "CashReport") {
        callback(null, model.CashReport(results));
      }

      if (table == "ProductPrice") {
        callback(null, model.ProductPrice(results));
      }

      if (table == "PriceChange") {
        callback(null, model.PriceChange(results));
      }

      if (table == "UserInfo") {
        callback(null, model.UserInfo(results));
      }

      if (table == "SystemLogs") {
        callback(null, model.SystemLogs(results));
      }

      if (table == "PurchaseOrder") {
        callback(null, model.PurchaseOrder(results));
      }

      if (table == "PurchaseOrderItems") {
        callback(null, model.PurchaseOrderItems(results));
      }

      if (table == "TransferOrders") {
        callback(null, model.TransferOrders(results));
      }

      if (table == "TransferOrderItems") {
        callback(null, model.TransferOrderItems(results));
      }

      if (table == "InventoryCount") {
        callback(null, model.InventoryCount(results));
      }

      if (table == "InventoryCountItems") {
        callback(null, model.InventoryCountItems(results));
      }

      if (table == "Production") {
        callback(null, model.Production(results));
      }

      if (table == "ProductionActivities") {
        callback(null, model.ProductionActivities(results));
      }

      if (table == "ProductionComponents") {
        callback(null, model.ProductionComponents(results));
      }

      if (table == "InventoryHistory") {
        callback(null, model.InventoryHistory(results));
      }

      if (table == "StockAdjustment") {
        callback(null, model.StockAdjustment(results));
      }

      if (table == "InventoryValuationReport") {
        callback(null, model.InventoryValuationReport(results));
      }

      if (table == "InventoryValuationItems") {
        callback(null, model.InventoryValuationItems(results));
      }

      if (table == "LabelPrinting") {
        callback(null, model.LabelPrinting(results));
      }

      if (table == "SampleItemLists") {
        callback(null, model.SampleItemLists(results));
      }

    });
  } catch (error) {
    console.log(error);
  }
};

exports.StoredProcedure = (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.StoredProcedureResult = (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.Update = async (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log('Rows affected:', results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.UpdateMultiple = async (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      console.log("Rows affected:", results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.CloseConnect = () => {
  connection.end();
};

exports.Insert = (stmt, todos, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        callback(err, null);
      }
      // callback(null, Row inserted: ${results});
      let data = [
        {
          rows: results.affectedRows,
          id: results.insertId,
        },
      ];
      callback(null, data);
      // console.log(Row inserted: ${results.affectedRows});
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.SelectResult = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Delete = (sql, id, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, id, (error, results, fields) => {
      console.log(results);

      if (error) {
        callback(error, null);
      }

      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.InsertTable = (tablename, data, callback) => {
  if (tablename == "master_access_type") {
    let sql = `INSERT INTO master_access_type(
            mat_accessname,
            mat_status,
            mat_createdby,
            mat_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_position_type") {
    let sql = `INSERT INTO master_position_type(
            mpt_positionname,
            mpt_status,
            mpt_createdby,
            mpt_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_user") {
    let sql = `INSERT INTO master_user(
            mu_employeeid,
            mu_accesstype,
            mu_positiontype,
            mu_username,
            mu_password,
            mu_status,
            mu_createdby,
            mu_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_employees") {
    let sql = `INSERT INTO master_employees(
            me_fullname,
            me_position,
            me_contactinfo,
            me_datehired,
            me_status,
            me_createdby,
            me_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_product") {
    let sql = `INSERT INTO master_product(
            mp_description,
            mp_price,
            mp_category,
            mp_barcode,
            mp_productimage,
            mp_status,
            mp_createdby,
            mp_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_category") {
    let sql = `INSERT INTO master_category(
            mc_categoryname,
            mc_status,
            mc_createdby,
            mc_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_pos") {
    let sql = `INSERT INTO master_pos(
            mp_posid,
            mp_posname,
            mp_serial,
            mp_min,
            mp_ptu,
            mp_status,
            mp_createdby,
            mp_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_branch") {
    let sql = `INSERT INTO master_branch(
            mb_branchid,
            mb_branchname,
            mb_tin,
            mb_address,
            mb_logo,
            mb_status,
            mb_createdby,
            mb_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_vendor") {
    let sql = `INSERT INTO master_vendor(
            mv_vendorname,
            mv_status,
            mv_createdby,
            mv_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_location") {
    let sql = `INSERT INTO master_location(
            ml_locationname,
            ml_status,
            ml_createdby,
            ml_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_material_cost") {
    let sql = `INSERT INTO master_material_cost(
            mmc_materialname,
            mmc_unitcost,
            mmc_unit,
            mmc_status,
            mmc_createdby,
            mmc_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "sales_detail") {
    let sql = `INSERT INTO sales_detail(
            st_detail_id,
            st_date,
            st_pos_id,
            st_shift,
            st_payment_type,
            st_description,
            st_total,
            st_cashier) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "sales_item") {
    let sql = `INSERT INTO sales_item(
            si_detail_id,
            si_date,
            si_item,
            si_price,
            si_quantity,
            si_total) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "shift_report") {
    let sql = `INSERT INTO shift_report(
            sr_date,
            sr_pos,
            sr_shift,
            sr_cashier,
            sr_floating,
            sr_cash_float,
            sr_sales_beginning,
            sr_sales_ending,
            sr_total_sales,
            sr_receipt_beginning,
            sr_receipt_ending,
            sr_status,
            sr_approvedby,
            sr_approveddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "cash_report") {
    let sql = `INSERT INTO cash_report(
            cr_report_id,
            cr_date,
            cr_shift,
            cr_pos,
            cr_cashier,
            cr_type,
            cr_status) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "product_price") {
    let sql = `INSERT INTO product_price(
            pp_product_id,
            pp_description,
            pp_barcode,
            pp_product_image,
            pp_price,
            pp_category,
            pp_previous_price,
            pp_price_change,
            pp_price_change_date,
            pp_status,
            pp_createdby,
            pp_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "price_change") {
    let sql = `INSERT INTO price_change(
            pc_price_change_id,
            pc_product_id,
            pc_price,
            pc_status,
            pc_createdby,
            pc_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "system_logs") {
    let sql = `INSERT INTO system_logs(
            sl_logdate,
            sl_loglevel,
            sl_source,
            sl_message,
            sl_userid,
            sl_ipaddress) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "purchase_order") {
    let sql = `INSERT INTO purchase_order(
            po_vendorid,
            po_orderdate,
            po_deliverydate,
            po_total_amount,
            po_paymentterms,
            po_deliverymethod,
            po_status) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "purchase_order_items") {
    let sql = `INSERT INTO purchase_order_items(
      poi_orderid,
      poi_description,
      poi_quantity,
      poi_unitprice,
      poi_totalprice) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "transfer_orders") {
    let sql = `INSERT INTO transfer_orders(
      to_fromlocationid,
      to_tolocationid,
      to_transferdate,
      to_totalquantity,
      to_status,
      to_notes) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "transfer_order_items") {
    let sql = `INSERT INTO transfer_order_items(
      toi_transferid,
      toi_productid,
      toi_quantity) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "inventory_count") {
    let sql = `INSERT INTO inventory_count(
      ic_count_date,
      ic_locationid,
      ic_countby,
      ic_countverification,
      ic_notes) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "inventory_count_items") {
    let sql = `INSERT INTO inventory_count_items(
      ici_countid,
      ici_productid,
      ici_countedby,
      ici_actualquantity,
      ici_variance) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }
  
  if (tablename == "production") {
    let sql = `INSERT INTO production(
      p_productid,
      p_startdate,
      p_enddate,
      p_quantityproduced,
      p_productionline,
      p_supervisorid,
      p_notes) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "production_activities") {
    let sql = `INSERT INTO production_activities(
      pa_productionid,
      pa_activityname,
      pa_startdate,
      pa_enddate,
      pa_workerid) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "production_components") {
    let sql = `INSERT INTO production_components(
      pc_productid,
      pc_details,
      pc_totalcost,
      pc_status,
      pc_createdby,
      pc_createddate) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "inventory_history") {
    let sql = `INSERT INTO inventory_history(
      ih_productid,
      ih_transactiondate,
      ih_transactiontype,
      ih_previousquantity,
      ih_changeinquantity,
      ih_newquantity,
      ih_notes) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "stock_adjustment") {
    let sql = `INSERT INTO stock_adjustment(
      sa_productid,
      sa_adjustmentdate,
      sa_adjustmenttype,
      sa_quantityadjusted,
      sa_reason,
      sa_adjustedby,
      sa_notes) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "inventory_valuation_report") {
    let sql = `INSERT INTO inventory_valuation_report(
      ivr_reportdate,
      ivr_generateby,
      ivr_notes) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "inventory_valuation_items") {
    let sql = `INSERT INTO inventory_valuation_items(
      ivi_reportid,
      ivi_productid,
      ivi_quantity,
      ivi_unitcost,
      ivi_totalvalue) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }
  
  if (tablename == "label_printing") {
    let sql = `INSERT INTO label_printing(
      lp_itemname,
      lp_itemcode,
      lp_quantity,
      lp_labeltype,
      lp_printdate,
      lp_printby,
      lp_notes
      ) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }
};
