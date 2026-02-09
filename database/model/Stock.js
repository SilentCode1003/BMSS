const Stock = {
  stock_adjustment: {
  tablename: "stock_adjustment",
  prefix: "sa",
  prefix_: "sa_",
  insertColumns: [
      "productid",
      "adjustmentdate",
      "adjustmenttype",
      "quantityadjusted",
      "reason",
      "adjustedby",
      "notes"
    ],
  selectColumns: [
      "sa_adjustmentid",
      "sa_productid",
      "sa_adjustmentdate",
      "sa_adjustmenttype",
      "sa_quantityadjusted",
      "sa_reason",
      "sa_adjustedby",
      "sa_notes"
    ],
  selectOptionColumns: {
    adjustmentid: "sa_adjustmentid",
    productid: "sa_productid",
    adjustmentdate: "sa_adjustmentdate",
    adjustmenttype: "sa_adjustmenttype",
    quantityadjusted: "sa_quantityadjusted",
    reason: "sa_reason",
    adjustedby: "sa_adjustedby",
    notes: "sa_notes"
  },
  updateOptionColumns: {
    adjustmentid: "adjustmentid",
    productid: "productid",
    adjustmentdate: "adjustmentdate",
    adjustmenttype: "adjustmenttype",
    quantityadjusted: "quantityadjusted",
    reason: "reason",
    adjustedby: "adjustedby",
    notes: "notes"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  stock_adjustment_detail: {
  tablename: "stock_adjustment_detail",
  prefix: "sad",
  prefix_: "sad_",
  insertColumns: [
      "branchid",
      "details",
      "reason",
      "createddate",
      "createdby",
      "notes",
      "status",
      "attachments"
    ],
  selectColumns: [
      "sad_id",
      "sad_branchid",
      "sad_details",
      "sad_reason",
      "sad_createddate",
      "sad_createdby",
      "sad_notes",
      "sad_status",
      "sad_attachments"
    ],
  selectOptionColumns: {
    id: "sad_id",
    branchid: "sad_branchid",
    details: "sad_details",
    reason: "sad_reason",
    createddate: "sad_createddate",
    createdby: "sad_createdby",
    notes: "sad_notes",
    status: "sad_status",
    attachments: "sad_attachments"
  },
  updateOptionColumns: {
    id: "id",
    branchid: "branchid",
    details: "details",
    reason: "reason",
    createddate: "createddate",
    createdby: "createdby",
    notes: "notes",
    status: "status",
    attachments: "attachments"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  stock_adjustment_item: {
  tablename: "stock_adjustment_item",
  prefix: "sai",
  prefix_: "sai_",
  insertColumns: [
      "detailid",
      "productid",
      "quantity",
      "stockafter"
    ],
  selectColumns: [
      "sai_id",
      "sai_detailid",
      "sai_productid",
      "sai_quantity",
      "sai_stockafter"
    ],
  selectOptionColumns: {
    id: "sai_id",
    detailid: "sai_detailid",
    productid: "sai_productid",
    quantity: "sai_quantity",
    stockafter: "sai_stockafter"
  },
  updateOptionColumns: {
    id: "id",
    detailid: "detailid",
    productid: "productid",
    quantity: "quantity",
    stockafter: "stockafter"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Stock = Stock;