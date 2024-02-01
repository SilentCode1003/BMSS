const {
  ProductPriceModel,
  ProductCategory,
  MasterAccessTypeModel,
  MasterPositionTypeModel,
  MasterUserModel,
  MasterEmployeesModel,
  MasterProductModel,
  MasterCategoryModel,
  MasterPosModel,
  MasterBranchModel,
  MasterVendorModel,
  MasterLocationModel,
  MasterMaterialCostModel,
  SalesDetailModel,
  SalesItemModel,
  ShiftReportModel,
  CashReporttModel,
  PriceChangeModel,
  UserInfoModel,
  SystemLogsModel,
  PurchaseOrderModel,
  PurchaseOrderItemsModel,
  TransferOrdersModel,
  TransferOrderItemsModel,
  InventoryCountModel,
  InventoryCountItemsModel,
  ProductionModel,
  ProductionActivitiesModel,
  ProductionComponentsModel,
  StockAdjustmentModel,
  InventoryValuationReportModel,
  InventoryValuationItemsModel,
  LabelPrintingModel,
  ProductionMaterialsModel,
  ProductionMaterialCountModel,
  ProductionLogsModel,
  ProductComponentModel,
  ProductionProductCostModel,
  POSShiftLogsModel,
  PromoDetailsModel,
  DiscountDetailsModel,
  EpaymentDetailsModel,
  CashierActivityModel,
  ProductInventoryModel,
  SalesInventoryHistoryModel,
  InventoryHistoryModel,
  ProductionInventoryModel,
  ProductionHistoryModel,
  SalesDiscountModel,
  MasterPaymentModel,
  ProductionTransferModel,
  SalesPromoModel,
} = require("./model");

exports.MasterAccessType = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      accesscode: key.mat_accesscode,
      accessname: key.mat_accessname,
      status: key.mat_status,
      createdby: key.mat_createdby,
      createddate: key.mat_createddate,
    });
  });

  return dataResult;
};

exports.MasterPositionType = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      positioncode: key.mpt_positioncode,
      positionname: key.mpt_positionname,
      status: key.mpt_status,
      createdby: key.mpt_createdby,
      createddate: key.mpt_createddate,
    });
  });

  return dataResult;
};

exports.MasterUser = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      usercode: key.mu_usercode,
      employeeid: key.mu_employeeid,
      accesstype: key.mu_accesstype,
      username: key.mu_username,
      password: key.mu_password,
      status: key.mu_status,
      branchid: key.mu_branchid,
      createdby: key.mu_createdby,
      createddate: key.mu_createddate,
    });
  });

  return dataResult;
};

exports.MasterEmployees = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.me_employeeid,
      fullname: key.me_fullname,
      position: key.me_position,
      contactinfo: key.me_contactinfo,
      datehired: key.me_datehired,
      status: key.me_status,
      createdby: key.me_createdby,
      createddate: key.me_createddate,
    });
  });

  return dataResult;
};

exports.MasterProduct = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      productid: key.mp_productid,
      description: key.mp_description,
      category: key.mp_category,
      productimage: key.mp_productimage,
      price: key.mp_price,
      barcode: key.mp_barcode,
      status: key.mp_status,
      createdby: key.mp_createdby,
      createddate: key.mp_createddate,
    });
  });

  return dataResult;
};

exports.MasterCategory = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      categorycode: key.mc_categorycode,
      categoryname: key.mc_categoryname,
      status: key.mc_status,
      createdby: key.mc_createdby,
      createddate: key.mc_createddate,
    });
  });

  return dataResult;
};

exports.MasterPos = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      posid: key.mp_posid,
      posname: key.mp_posname,
      serial: key.mp_serial,
      min: key.mp_min,
      ptu: key.mp_ptu,
      status: key.mp_status,
      createdby: key.mp_createdby,
      createddate: key.mp_createddate,
    });
  });

  return dataResult;
};

exports.MasterBranch = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      branchid: key.mb_branchid,
      branchname: key.mb_branchname,
      tin: key.mb_tin,
      address: key.mb_address,
      logo: key.mb_logo,
      status: key.mb_status,
      createdby: key.mb_createdby,
      createddate: key.mb_createddate,
    });
  });

  return dataResult;
};

exports.MasterVendor = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      vendorid: key.mv_vendorid,
      vendorname: key.mv_vendorname,
      contactname: key.mv_contactname,
      contactemail: key.mv_contactemail,
      contactphone: key.mv_contactphone,
      address: key.mv_address,
      status: key.mv_status,
      createdby: key.mv_createdby,
      createddate: key.mv_createddate,
    });
  });

  return dataResult;
};

exports.MasterLocation = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      locationid: key.ml_locationid,
      locationname: key.ml_locationname,
      status: key.ml_status,
      createdby: key.ml_createdby,
      createddate: key.ml_createddate,
    });
  });

  return dataResult;
};

exports.MasterMaterialCost = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      materialid: key.mmc_materialid,
      materialname: key.mmc_materialname,
      unitcost: key.mmc_unitcost,
      unit: key.mmc_unit,
      status: key.mmc_status,
      createdby: key.mmc_createdby,
      createddate: key.mmc_createddate,
    });
  });

  return dataResult;
};

exports.SalesDetail = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      detailid: key.st_detail_id,
      date: key.st_date,
      posid: key.st_pos_id,
      shift: key.st_shift,
      paymenttype: key.st_payment_type,
      description: key.st_description,
      total: key.st_total,
      cashier: key.st_cashier,
      branch: key.st_branch,
    });
  });

  return dataResult;
};

exports.SalesItem = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      detailid: key.si_detail_id,
      date: key.si_date,
      item: key.si_item,
      price: key.si_price,
      quantity: key.si_quantity,
      total: key.si_total,
    });
  });

  return dataResult;
};

exports.ShiftReport = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      date: key.sr_date,
      pos: key.sr_pos,
      shift: key.sr_shift,
      cashier: key.sr_cashier,
      floating: key.sr_floating,
      cashfloat: key.sr_cash_float,
      salesbeginning: key.sr_sales_beginning,
      salesending: key.sr_sales_ending,
      totalsales: key.sr_total_sales,
      receiptbeginning: key.sr_receipt_beginning,
      receiptending: key.sr_receipt_ending,
      status: key.sr_status,
      approvedby: key.sr_approvedby,
      approveddate: key.sr_approveddate,
    });
  });

  return dataResult;
};

exports.CashReport = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      reportid: key.cr_report_id,
      date: key.cr_date,
      shift: key.cr_shift,
      pos: key.cr_pos,
      cashier: key.cr_cashier,
      type: key.cr_type,
      status: key.cr_status,
    });
  });

  return dataResult;
};

exports.ProductPrice = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      productpriceid: key.pp_product_price_id,
      productid: key.pp_product_id,
      description: key.pp_description,
      barcode: key.pp_barcode,
      productimage: key.pp_product_image,
      price: key.pp_price,
      category: key.pp_category,
      previousprice: key.pp_previous_price,
      pricechange: key.pp_price_change,
      pricechangedate: key.pp_price_change_date,
      status: key.pp_status,
      createdby: key.pp_createdby,
      createddate: key.pp_createddate,
    });
  });

  return dataResult;
};

exports.PriceChange = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      pricechangeid: key.pc_price_change_id,
      productid: key.pc_product_id,
      price: key.pc_price,
      status: key.pc_status,
      createdby: key.pc_createdby,
      createddate: key.pc_createddate,
    });
  });

  return dataResult;
};

exports.UserInfo = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      employeeid: key.me_employeeid,
      fullname: key.me_fullname,
      position: key.me_position,
      contactinfo: key.me_contactinfo,
      datehired: key.me_datehired,
      usercode: key.mu_usercode,
      accesstype: key.mu_accesstype,
      positiontype: key.mu_positiontype,
      status: key.mu_status,
    });
  });

  return dataResult;
};

exports.SystemLogs = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      logid: key.sl_logid,
      logdate: key.sl_logdate,
      loglevel: key.sl_loglevel,
      source: key.sl_source,
      message: key.sl_message,
      userid: key.sl_userid,
      ipaddress: key.sl_ipaddress,
    });
  });

  return dataResult;
};

exports.PurchaseOrder = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      orderid: key.po_orderid,
      vendorid: key.po_vendorid,
      orderdate: key.po_orderdate,
      deliverydate: key.po_deliverydate,
      amount: key.po_total_amount,
      paymentterms: key.po_paymentterms,
      deliverymethod: key.po_deliverymethod,
      status: key.po_status,
    });
  });

  return dataResult;
};

exports.PurchaseOrderItems = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      productid: key.poi_productid,
      orderid: key.poi_orderid,
      description: key.poi_description,
      quantity: key.poi_quantity,
      unitprice: key.poi_unitprice,
      totalprice: key.poi_totalprice,
    });
  });

  return dataResult;
};

exports.TransferOrders = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      transferid: key.to_transferid,
      fromlocationid: key.to_fromlocationid,
      tolocationid: key.to_tolocationid,
      transferdate: key.to_transferdate,
      totalquantity: key.to_totalquantity,
      status: key.to_status,
      notes: key.to_notes,
    });
  });

  return dataResult;
};

exports.TransferOrderItems = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      itemid: key.toi_itemid,
      transferid: key.toi_transferid,
      productid: key.toi_productid,
      quantity: key.toi_quantity,
    });
  });

  return dataResult;
};

exports.InventoryCount = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      countid: key.ic_countid,
      countdate: key.ic_count_date,
      locationid: key.ic_locationid,
      countby: key.ic_countby,
      countverification: key.ic_countverification,
      notes: key.ic_notes,
    });
  });

  return dataResult;
};

exports.InventoryCountItems = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      itemid: key.ici_itemid,
      countid: key.ici_countid,
      productid: key.ici_productid,
      countedby: key.ici_countedby,
      actualquantity: key.ici_actualquantity,
      variance: key.ici_variance,
    });
  });

  return dataResult;
};

exports.Production = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      productionid: key.p_productionid,
      productid: key.p_productid,
      startdate: key.p_startdate,
      enddate: key.p_enddate,
      quantityproduced: key.p_quantityproduced,
      productiononline: key.p_productionline,
      supervisorid: key.p_supervisorid,
      notes: key.p_notes,
      status: key.p_status,
    });
  });

  return dataResult;
};

exports.ProductionActivities = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      avtivityid: key.pa_activityid,
      productionid: key.pa_productionid,
      activityname: key.pa_activityname,
      startdate: key.pa_startdate,
      enddate: key.pa_enddate,
      workerid: key.pa_workerid,
    });
  });

  return dataResult;
};

exports.ProductionComponents = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      componentid: key.pc_componentid,
      productid: key.pc_productid,
      details: key.pc_details,
      totalcost: key.pc_totalcost,
      status: key.pc_status,
      createdby: key.pc_createdby,
      createddate: key.pc_createddate,
    });
  });

  return dataResult;
};

exports.StockAdjustment = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      adjustmentid: key.sa_adjustmentid,
      productid: key.sa_productid,
      adjustmentdate: key.sa_adjustmentdate,
      adjustmenttype: key.sa_adjustmenttype,
      quantityadjusted: key.sa_quantityadjusted,
      reason: key.sa_reason,
      adjustedby: key.sa_adjustedby,
      notes: key.sa_notes,
    });
  });

  return dataResult;
};

exports.InventoryValuationReport = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      reportid: key.ivr_reportid,
      reportdate: key.ivr_reportdate,
      generatedby: key.ivr_generateby,
      notes: key.ivr_notes,
    });
  });

  return dataResult;
};

exports.InventoryValuationItems = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      itemid: key.ivi_itemid,
      reportid: key.ivi_reportid,
      productid: key.ivi_productid,
      quantity: key.ivi_quantity,
      unitcost: key.ivi_unitcost,
      totalvalue: key.ivi_totalvalue,
      branchid: key.ivi_branchid,
      category: key.ivi_category,
      productname: key.ivi_productname
    });
  });

  return dataResult;
};

exports.LabelPrinting = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      labelid: key.lp_labelid,
      itemname: key.lp_itemname,
      itemcode: key.lp_itemcode,
      quantity: key.lp_quantity,
      labeltype: key.lp_labeltype,
      printdate: key.lp_printdate,
      printby: key.lp_printby,
      notes: key.lp_notes,
    });
  });

  return dataResult;
};

exports.ProductionMaterials = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      productid: key.mpm_productid,
      productname: key.mpm_productname,
      description: key.mpm_description,
      category: key.mpm_category,
      vendorid: key.mpm_vendorid,
      price: key.mpm_price,
      status: key.mpm_status,
      createdby: key.mpm_createdby,
      createddate: key.mpm_createddate,
    });
  });

  return dataResult;
};

exports.ProductionMaterialCount = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      countid: key.pmc_countid,
      productid: key.pmc_productid,
      quantity: key.pmc_quantity,
      unit: key.pmc_unit,
      status: key.pmc_status,
      createdby: key.pmc_createdby,
      createddate: key.pmc_createddate,
    });
  });

  return dataResult;
};

exports.ProductionLogs = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      logid: key.pl_logid,
      description: key.pl_description,
      status: key.pl_status,
      date: key.pl_date,
    });
  });

  return dataResult;
};

exports.ProductComponent = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      componentid: key.pc_componentid,
      productid: key.pc_productid,
      components: key.pc_components,
      status: key.pc_status,
      createdby: key.pc_createdby,
      createddate: key.pc_createddate,
    });
  });

  return dataResult;
};

exports.ProductionProductCost = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      productionid: key.ppc_productionid,
      componentid: key.ppc_componentid,
      productid: key.ppc_productid,
      cost: key.ppc_cost,
      status: key.ppc_status,
      createdby: key.ppc_createdby,
      createddate: key.ppc_createddate,
    });
  });

  return dataResult;
};

exports.POSShiftLogs = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      id: key.psl_id,
      posid: key.psl_posid,
      date: key.psl_date,
      shift: key.psl_shift,
      status: key.psl_status,
    });
  });

  return dataResult;
};

exports.PromoDetails = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      promoid: key.pd_promoid,
      name: key.pd_name,
      description: key.pd_description,
      dtipermit: key.pd_dtipermit,
      condition: key.pd_condition,
      startdate: key.pd_startdate,
      enddate: key.pd_enddate,
      status: key.pd_status,
      createdby: key.pd_createdby,
      createddate: key.pd_createddate,
    });
  });

  return dataResult;
};

exports.DiscountDetails = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      discountid: key.dd_discountid,
      name: key.dd_name,
      description: key.dd_description,
      rate: key.dd_rate,
      status: key.dd_status,
      createdby: key.dd_createdby,
      createddate: key.dd_createddate,
    });
  });

  return dataResult;
};

exports.EpaymentDetails = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      paymentid: key.ed_paymentid,
      detailid: key.ed_detailid,
      type: key.ed_type,
      referenceid: key.ed_referenceid,
      date: key.ed_date,
    });
  });

  return dataResult;
};

exports.CashierActivity = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      activityid: key.ca_activityid,
      detailid: key.ca_detailid,
      paymenttype: key.ca_paymenttype,
      amount: key.ca_amount,
      date: key.ca_date,
    });
  });

  return dataResult;
};

exports.ProductInventory = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      inventoryid: key.pi_inventoryid,
      productid: key.pi_productid,
      branchid: key.pi_branchid,
      quantity: key.pi_quantity,
      category: key.pi_category,
    });
  });

  return dataResult;
};

exports.SalesInventoryHistory = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      historyid: key.sih_historyid,
      detailid: key.sih_detailid,
      date: key.sih_date,
      productid: key.sih_productid,
      branch: key.sih_branch,
      quantity: key.sih_quantity,
    });
  });

  return dataResult;
};

exports.InventoryHistory = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      historyid: key.ih_historyid,
      productid: key.ih_productid,
      quantity: key.ih_quantity,
      type: key.ih_type,
      createddate: key.ih_createddate,
      createdby: key.ih_createdby,
    });
  });

  return dataResult;
};

exports.ProductionInventory = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      inventoryid: key.pi_inventoryid,
      productid: key.pi_productid,
      quantity: key.pi_quantity,
    });
  });

  return dataResult;
};

exports.ProductionHistory = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      historyid: key.ph_historyid,
      productionid: key.ph_productionid,
      quantity: key.ph_quantity,
    });
  });

  return dataResult;
};

exports.SalesDiscount = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      id: key.sd_id,
      detailid: key.sd_detailid,
      discountid: key.sd_discountid,
      customerinfo: key.sd_customerinfo,
      amount: key.sd_amount,
    });
  });

  return dataResult;
};

exports.MasterPayment = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      paymentid: key.mp_paymentid,
      paymentname: key.mp_paymentname,
      status: key.mp_status,
      createdby: key.mp_createdby,
      createddate: key.mp_createddate,
    });
  });

  return dataResult;
};

exports.ProductionTransfer = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      transferid: key.pt_transferid,
      productid: key.pt_productid,
      quantity: key.pt_quantity,
      branchid: key.pt_branchid,
      status: key.pt_status,
      createdby: key.pt_createdby,
      createddate: key.pt_createddate,
    });
  });

  return dataResult;
};

exports.SalesPromo = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      id: key.sp_id,
      promoid: key.sp_promoid,
      detailid: key.sp_detailid,
    });
  });

  return dataResult;
};

exports.Notification = (data) => {
  let dataResult = [];

  data.forEach((key, item) => {
    dataResult.push({
      id: key.n_id,
      userid: key.n_userid,
      productid: key.n_inventoryid,
      branchid: key.n_branchid,
      quantity: key.n_quantity,
      message: key.n_message,
      status: key.n_status,
      checker: key.n_checker,
      date: key.n_date,
    });
  });

  return dataResult;
};
