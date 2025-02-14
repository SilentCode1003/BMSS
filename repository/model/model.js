//#region  SQL DATA MODEL
class ProductPriceModel {
  constructor(
    productpriceid,
    productid,
    description,
    barcode,
    productimage,
    price,
    category,
    previousprice,
    pricechange,
    pricechangedate,
    status,
    createdby,
    createddate
  ) {
    this.productpriceid = productpriceid;
    this.productid = productid;
    this.description = description;
    this.barcode = barcode;
    this.productimage = productimage;
    this.price = price;
    this.category = category;
    this.previousprice = previousprice;
    this.pricechange = pricechange;
    this.pricechangedate = pricechangedate;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class ProductCategory {
  constructor(
    productid,
    description,
    barcode,
    price,
    category,
    quantity
  ) {
    this.productid = productid;
    this.description = description;
    this.barcode = barcode;
    this.price = price;
    this.category = category;
    this.quantity = quantity;
  }
}

class MasterAccessTypeModel {
  constructor(accesscode, accessname, status, createdby, createddate) {
    this.accesscode = accesscode;
    this.accessname = accessname;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterPositionTypeModel {
  constructor(positioncode, positionname, status, createdby, createddate) {
    this.positioncode = positioncode;
    this.positionname = positionname;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterUserModel {
  constructor(
    usercode,
    employeeid,
    accesstype,
    username,
    password,
    status,
    branchid,
    createdby,
    createddate
  ) {
    this.usercode = usercode;
    this.employeeid = employeeid;
    this.accesstype = accesstype;
    this.username = username;
    this.password = password;
    this.status = status;
    this.branchid = branchid;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterEmployeesModel {
  constructor(
    employeeid,
    fullname,
    position,
    contactinfo,
    datehired,
    status,
    createdby,
    createddate
  ) {
    this.employeeid = employeeid;
    this.fullname = fullname;
    this.position = position;
    this.contactinfo = contactinfo;
    this.datehired = datehired;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterProductModel {
  constructor(
    productid,
    description,
    category,
    productimage,
    price,
    barcode,
    status,
    createdby,
    createddate,
    cost
  ) {
    this.productid = productid;
    this.description = description;
    this.category = category;
    this.productimage = productimage;
    this.price = price;
    this.barcode = barcode;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
    this.cost = cost;
  }
}

class MasterCategoryModel {
  constructor(categorycode, categoryname, status, createdby, createddate) {
    this.categorycode = categorycode;
    this.categoryname = categoryname;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterPosModel {
  constructor(
    posid,
    posname,
    serial,
    min,
    ptu,
    status,
    createdby,
    createddate
  ) {
    this.posid = posid;
    this.posname = posname;
    this.serial = serial;
    this.min = min;
    this.ptu = ptu;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterBranchModel {
  constructor(
    branchid,
    branchname,
    tin,
    address,
    logo,
    status,
    createdby,
    createddate
  ) {
    this.branchid = branchid;
    this.branchname = branchname;
    this.tin = tin;
    this.address = address;
    this.logo = logo;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterVendorModel {
  constructor(
    vendorid,
    vendorname,
    contactname,
    contactemail,
    contactphone,
    address,
    status,
    createdby,
    createddate
  ) {
    this.vendorid = vendorid;
    this.vendorname = vendorname;
    this.contactname = contactname;
    this.contactemail = contactemail;
    this.contactphone = contactphone;
    this.address = address;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterLocationModel {
  constructor(locationid, locationname, status, createdby, createddate) {
    this.locationid = locationid;
    this.locationname = locationname;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class MasterMaterialCostModel {
  constructor(
    materialid,
    materialname,
    unitcost,
    unit,
    status,
    createdby,
    createddate
  ) {
    this.materialid = materialid;
    this.materialname = materialname;
    this.unitcost = unitcost;
    this.unit = unit;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class SalesDetailModel {
  constructor(
    detailid,
    date,
    posid,
    shift,
    paymenttype,
    description,
    total,
    cashier,
    branch
  ) {
    this.detailid = detailid;
    this.date = date;
    this.posid = posid;
    this.shift = shift;
    this.paymenttype = paymenttype;
    this.description = description;
    this.total = total;
    this.cashier = cashier;
    this.branch = branch;
  }
}

class SalesItemModel {
  constructor(detailid, date, item, price, quantity, total) {
    this.detailid = detailid;
    this.date = date;
    this.item = item;
    this.price = price;
    this.quantity = quantity;
    this.total = total;
  }
}

class ShiftReportModel {
  constructor(
    date,
    pos,
    shift,
    cashier,
    floating,
    cashfloat,
    salesbeginning,
    salesending,
    totalsales,
    receiptbeginning,
    receiptending,
    status,
    approvedby,
    approveddate
  ) {
    this.date = date;
    this.pos = pos;
    this.shift = shift;
    this.cashier = cashier;
    this.floating = floating;
    this.cashfloat = cashfloat;
    this.salesbeginning = salesbeginning;
    this.salesending = salesending;
    this.totalsales = totalsales;
    this.receiptbeginning = receiptbeginning;
    this.receiptending = receiptending;
    this.status = status;
    this.approvedby = approvedby;
    this.approveddate = approveddate;
  }
}

class CashReporttModel {
  constructor(reportid, date, shift, pos, cashier, type, status) {
    this.reportid = reportid;
    this.date = date;
    this.shift = shift;
    this.pos = pos;
    this.cashier = cashier;
    this.type = type;
    this.status = status;
  }
}

class PriceChangeModel {
  constructor(pricechangeid, productid, price, status, createdby, createddate) {
    this.pricechangeid = pricechangeid;
    this.productid = productid;
    this.price = price;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class UserInfoModel {
  constructor(
    employeeid,
    fullname,
    position,
    contactinfo,
    datehired,
    usercode,
    accesstype,
    positiontype,
    status
  ) {
    this.employeeid = employeeid;
    this.fullname = fullname;
    this.position = position;
    this.contactinfo = contactinfo;
    this.datehired = datehired;
    this.usercode = usercode;
    this.accesstype = accesstype;
    this.positiontype = positiontype;
    this.status = status;
  }
}

class SystemLogsModel {
  constructor(logid, logdate, loglevel, source, message, userid, ipaddress) {
    this.logid = logid;
    this.logdate = logdate;
    this.loglevel = loglevel;
    this.source = source;
    this.message = message;
    this.userid = userid;
    this.ipaddress = ipaddress;
  }
}

class PurchaseOrderModel {
  constructor(
    orderid,
    vendorid,
    orderdate,
    deliverydate,
    amount,
    paymentterms,
    deliverymethod,
    status
  ) {
    this.orderid = orderid;
    this.vendorid = vendorid;
    this.orderdate = orderdate;
    this.deliverydate = deliverydate;
    this.amount = amount;
    this.paymentterms = paymentterms;
    this.deliverymethod = deliverymethod;
    this.status = status;
  }
}

class PurchaseOrderItemsModel {
  constructor(
    productid,
    orderid,
    description,
    quantity,
    unitprice,
    totalprice
  ) {
    this.productid = productid;
    this.orderid = orderid;
    this.description = description;
    this.quantity = quantity;
    this.unitprice = unitprice;
    this.totalprice = totalprice;
  }
}

class TransferOrdersModel {
  constructor(
    transferid,
    fromlocationid,
    tolocationid,
    transferdate,
    totalquantity,
    status,
    notes
  ) {
    this.transferid = transferid;
    this.fromlocationid = fromlocationid;
    this.tolocationid = tolocationid;
    this.transferdate = transferdate;
    this.totalquantity = totalquantity;
    this.status = status;
    this.notes = notes;
  }
}

class TransferOrderItemsModel {
  constructor(itemid, transferid, productid, quantity) {
    this.itemid = itemid;
    this.transferid = transferid;
    this.productid = productid;
    this.quantity = quantity;
  }
}

class InventoryCountModel {
  constructor(
    countid,
    countdate,
    locationid,
    countby,
    countverification,
    notes
  ) {
    this.countid = countid;
    this.countdate = countdate;
    this.locationid = locationid;
    this.countby = countby;
    this.countverification = countverification;
    this.notes = notes;
  }
}

class InventoryCountItemsModel {
  constructor(itemid, countid, productid, countedby, actualquantity, variance) {
    this.itemid = itemid;
    this.countid = countid;
    this.productid = productid;
    this.countedby = countedby;
    this.actualquantity = actualquantity;
    this.variance = variance;
  }
}

class ProductionModel {
  constructor(
    productionid,
    productid,
    startdate,
    enddate,
    quantityproduced,
    productionline,
    supervisorid,
    notes,
    status
  ) {
    this.productionid = productionid;
    this.productid = productid;
    this.startdate = startdate;
    this.enddate = enddate;
    this.quantityproduced = quantityproduced;
    this.productionline = productionline;
    this.supervisorid = supervisorid;
    this.notes = notes;
    this.status = status;
  }
}

class ProductionActivitiesModel {
  constructor(
    activityid,
    productionid,
    activityname,
    startdate,
    enddate,
    workerid
  ) {
    this.activityid = activityid;
    this.productionid = productionid;
    this.activityname = activityname;
    this.startdate = startdate;
    this.enddate = enddate;
    this.workerid = workerid;
  }
}

class ProductionComponentsModel {
  constructor(
    componentid,
    productid,
    details,
    totalcost,
    status,
    createdby,
    createddate
  ) {
    this.componentid = componentid;
    this.productid = productid;
    this.details = details;
    this.totalcost = totalcost;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class StockAdjustmentModel {
  constructor(
    adjustmentid,
    productid,
    adjustmentdate,
    adjustmenttype,
    quantityadjusted,
    reason,
    adjustedby,
    notes
  ) {
    this.adjustmentid = adjustmentid;
    this.productid = productid;
    this.adjustmentdate = adjustmentdate;
    this.adjustmenttype = adjustmenttype;
    this.quantityadjusted = quantityadjusted;
    this.reason = reason;
    this.adjustedby = adjustedby;
    this.notes = notes;
  }
}

class InventoryValuationReportModel {
  constructor(
    adjustmentid,
    productid,
    adjustmentdate,
    adjustmenttype,
    quantityadjusted,
    reason,
    adjustedby,
    notes
  ) {
    this.adjustmentid = adjustmentid;
    this.productid = productid;
    this.adjustmentdate = adjustmentdate;
    this.adjustmenttype = adjustmenttype;
    this.quantityadjusted = quantityadjusted;
    this.reason = reason;
    this.adjustedby = adjustedby;
    this.notes = notes;
  }
}

class InventoryValuationItemsModel {
  constructor(
    itemid,
    reportid,
    productid,
    quantity,
    unitcost,
    totalvalue,
    branchid,
    category,
    productname
  ) {
    this.itemid = itemid;
    this.reportid = reportid;
    this.productid = productid;
    this.quantity = quantity;
    this.unitcost = unitcost;
    this.totalvalue = totalvalue;
    this.branchid = branchid;
    this.category = category;
    this.productname = productname;
  }
}

class LabelPrintingModel {
  constructor(
    labelid,
    itemname,
    itemcode,
    quantity,
    labeltype,
    printdate,
    printby,
    notes
  ) {
    this.labelid = labelid;
    this.itemname = itemname;
    this.itemcode = itemcode;
    this.quantity = quantity;
    this.labeltype = labeltype;
    this.printdate = printdate;
    this.printby = printby;
    this.notes = notes;
  }
}

class ProductionMaterialsModel {
  constructor(
    productid,
    productname,
    description,
    category,
    vendorid,
    price,
    status,
    createdby,
    createddate
  ) {
    this.productid = productid;
    this.productname = productname;
    this.description = description;
    this.category = category;
    this.vendorid = vendorid;
    this.price = price;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class ProductionMaterialCountModel {
  constructor(
    countid,
    productid,
    quantity,
    unit,
    status,
    createdby,
    createddate
  ) {
    this.countid = countid;
    this.productid = productid;
    this.quantity = quantity;
    this.unit = unit;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class ProductionLogsModel {
  constructor(logid, description, status, date) {
    this.logid = logid;
    this.description = description;
    this.status = status;
    this.date = date;
  }
}

class ProductComponentModel {
  constructor(
    componentid,
    productid,
    components,
    status,
    createdby,
    createddate
  ) {
    this.componentid = componentid;
    this.productid = productid;
    this.components = components;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class ProductionProductCostModel {
  constructor(
    productionid,
    componentid,
    productid,
    cost,
    status,
    createdby,
    createddate
  ) {
    this.productionid = productionid;
    this.componentid = componentid;
    this.productid = productid;
    this.cost = cost;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class POSShiftLogsModel {
  constructor(id, posid, date, shift, status) {
    this.id = id;
    this.posid = posid;
    this.date = date;
    this.shift = shift;
    this.status = status;
  }
}

class PromoDetailsModel {
  constructor(
    promoid,
    name,
    description,
    dtipermit,
    condition,
    startdate,
    enddate,
    status,
    createdby,
    createddate
  ) {
    this.promoid = promoid;
    this.name = name;
    this.description = description;
    this.dtipermit = dtipermit;
    this.condition = condition;
    this.startdate = startdate;
    this.enddate = enddate;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class DiscountDetailsModel {
  constructor(
    discountid,
    name,
    description,
    rate,
    status,
    createdby,
    createddate
  ) {
    this.discountid = discountid;
    this.name = name;
    this.description = description;
    this.rate = rate;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class EpaymentDetailsModel {
  constructor(paymentid, detailid, type, referenceid, date) {
    this.paymentid = paymentid;
    this.detailid = detailid;
    this.type = type;
    this.referenceid = referenceid;
    this.date = date;
  }
}

class CashierActivityModel {
  constructor(activityid, detailid, paymenttype, amount, date) {
    this.activityid = activityid;
    this.detailid = detailid;
    this.paymenttype = paymenttype;
    this.amount = amount;
    this.date = date;
  }
}

class ProductInventoryModel {
  constructor(inventoryid, productid, branchid, quantity) {
    this.inventoryid = inventoryid;
    this.productid = productid;
    this.branchid = branchid;
    this.quantity = quantity;
  }
}

class SalesInventoryHistoryModel {
  constructor(historyid, detailid, date, productid, branch, quantity) {
    this.historyid = historyid;
    this.detailid = detailid;
    this.date = date;
    this.productid = productid;
    this.branch = branch;
    this.quantity = quantity;
  }
}

class InventoryHistoryModel {
  constructor(historyid, productid, quantity, type, createddate, createdby) {
    this.historyid = historyid;
    this.productid = productid;
    this.quantity = quantity;
    this.type = type;
    this.createddate = createddate;
    this.createdby = createdby;
  }
}

class ProductionInventoryModel {
  constructor(inventoryid, productid, quantity) {
    this.inventoryid = inventoryid;
    this.productid = productid;
    this.quantity = quantity;
  }
}

class ProductionHistoryModel {
  constructor(historyid, productionid, quantity) {
    this.historyid = historyid;
    this.productionid = productionid;
    this.quantity = quantity;
  }
}

class SalesDiscountModel {
  constructor(id, detailid, discountid, customerinfo, amount) {
    this.id = id;
    this.detailid = detailid;
    this.discountid = discountid;
    this.customerinfo = customerinfo;
    this.amount = amount;
  }
}

class MasterPaymentModel {
  constructor(paymentid, paymentname, status, createdby, createddate) {
    this.paymentid = paymentid;
    this.paymentname = paymentname;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class ProductionTransferModel {
  constructor(
    transferid,
    productid,
    quantity,
    branchid,
    status,
    createdby,
    createddate
  ) {
    this.transferid = transferid;
    this.productid = productid;
    this.quantity = quantity;
    this.branchid = branchid;
    this.status = status;
    this.createdby = createdby;
    this.createddate = createddate;
  }
}

class SalesPromoModel {
  constructor(id, promoid, detailid) {
    this.id = id;
    this.promoid = promoid;
    this.detailid = detailid;
  }
}
//#endregion

class DataModel {
  constructor(data, prefix) {
    for (const key in data) {
      this[key.replace(prefix, "")] = data[key];
    }
  }
}

class RawDataModel {
  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }
  }
}

module.exports = {
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
  DataModel,
  RawDataModel,
};
