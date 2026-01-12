const Inventory = {
  inventory_count: {
  tablename: "inventory_count",
  prefix: "ic",
  prefix_: "ic_",
  insertColumns: [
      "count_date",
      "locationid",
      "countby",
      "countverification",
      "notes"
    ],
  selectColumns: [
      "ic_countid",
      "ic_count_date",
      "ic_locationid",
      "ic_countby",
      "ic_countverification",
      "ic_notes"
    ],
  selectOptionColumns: {
    countid: "ic_countid",
    count_date: "ic_count_date",
    locationid: "ic_locationid",
    countby: "ic_countby",
    countverification: "ic_countverification",
    notes: "ic_notes"
  },
  updateOptionColumns: {
    countid: "countid",
    count_date: "count_date",
    locationid: "locationid",
    countby: "countby",
    countverification: "countverification",
    notes: "notes"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  inventory_valuation_report: {
  tablename: "inventory_valuation_report",
  prefix: "ivr",
  prefix_: "ivr_",
  insertColumns: [
      "reportdate",
      "generateby",
      "notes"
    ],
  selectColumns: [
      "ivr_reportid",
      "ivr_reportdate",
      "ivr_generateby",
      "ivr_notes"
    ],
  selectOptionColumns: {
    reportid: "ivr_reportid",
    reportdate: "ivr_reportdate",
    generateby: "ivr_generateby",
    notes: "ivr_notes"
  },
  updateOptionColumns: {
    reportid: "reportid",
    reportdate: "reportdate",
    generateby: "generateby",
    notes: "notes"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  inventory_valuation_items: {
  tablename: "inventory_valuation_items",
  prefix: "ivi",
  prefix_: "ivi_",
  insertColumns: [
      "reportid",
      "productid",
      "quantity",
      "unitcost",
      "totalvalue",
      "branchid",
      "category",
      "productname"
    ],
  selectColumns: [
      "ivi_itemid",
      "ivi_reportid",
      "ivi_productid",
      "ivi_quantity",
      "ivi_unitcost",
      "ivi_totalvalue",
      "ivi_branchid",
      "ivi_category",
      "ivi_productname"
    ],
  selectOptionColumns: {
    itemid: "ivi_itemid",
    reportid: "ivi_reportid",
    productid: "ivi_productid",
    quantity: "ivi_quantity",
    unitcost: "ivi_unitcost",
    totalvalue: "ivi_totalvalue",
    branchid: "ivi_branchid",
    category: "ivi_category",
    productname: "ivi_productname"
  },
  updateOptionColumns: {
    itemid: "itemid",
    reportid: "reportid",
    productid: "productid",
    quantity: "quantity",
    unitcost: "unitcost",
    totalvalue: "totalvalue",
    branchid: "branchid",
    category: "category",
    productname: "productname"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  inventory_history: {
  tablename: "inventory_history",
  prefix: "ih",
  prefix_: "ih_",
  insertColumns: [
      "productid",
      "quantity",
      "type",
      "createddate",
      "createdby"
    ],
  selectColumns: [
      "ih_historyid",
      "ih_productid",
      "ih_quantity",
      "ih_type",
      "ih_createddate",
      "ih_createdby"
    ],
  selectOptionColumns: {
    historyid: "ih_historyid",
    productid: "ih_productid",
    quantity: "ih_quantity",
    type: "ih_type",
    createddate: "ih_createddate",
    createdby: "ih_createdby"
  },
  updateOptionColumns: {
    historyid: "historyid",
    productid: "productid",
    quantity: "quantity",
    type: "type",
    createddate: "createddate",
    createdby: "createdby"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Inventory = Inventory;