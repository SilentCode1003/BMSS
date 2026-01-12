const Sale = {
  sales_detail: {
  tablename: "sales_detail",
  prefix: "st",
  prefix_: "st_",
  insertColumns: [
      "detail_id",
      "date",
      "pos_id",
      "shift",
      "payment_type",
      "description",
      "total",
      "cashier",
      "branch",
      "status"
    ],
  selectColumns: [
      "st_detail_id",
      "st_date",
      "st_pos_id",
      "st_shift",
      "st_payment_type",
      "st_description",
      "st_total",
      "st_cashier",
      "st_branch",
      "st_status"
    ],
  selectOptionColumns: {
    detail_id: "st_detail_id",
    date: "st_date",
    pos_id: "st_pos_id",
    shift: "st_shift",
    payment_type: "st_payment_type",
    description: "st_description",
    total: "st_total",
    cashier: "st_cashier",
    branch: "st_branch",
    status: "st_status"
  },
  updateOptionColumns: {
    detail_id: "detail_id",
    date: "date",
    pos_id: "pos_id",
    shift: "shift",
    payment_type: "payment_type",
    description: "description",
    total: "total",
    cashier: "cashier",
    branch: "branch",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  sales_item: {
  tablename: "sales_item",
  prefix: "si",
  prefix_: "si_",
  insertColumns: [
      "detail_id",
      "date",
      "item",
      "price",
      "quantity",
      "total"
    ],
  selectColumns: [
      "si_id",
      "si_detail_id",
      "si_date",
      "si_item",
      "si_price",
      "si_quantity",
      "si_total"
    ],
  selectOptionColumns: {
    id: "si_id",
    detail_id: "si_detail_id",
    date: "si_date",
    item: "si_item",
    price: "si_price",
    quantity: "si_quantity",
    total: "si_total"
  },
  updateOptionColumns: {
    id: "id",
    detail_id: "detail_id",
    date: "date",
    item: "item",
    price: "price",
    quantity: "quantity",
    total: "total"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  sales_inventory_history: {
  tablename: "sales_inventory_history",
  prefix: "sih",
  prefix_: "sih_",
  insertColumns: [
      "detailid",
      "date",
      "productid",
      "branch",
      "quantity"
    ],
  selectColumns: [
      "sih_historyid",
      "sih_detailid",
      "sih_date",
      "sih_productid",
      "sih_branch",
      "sih_quantity"
    ],
  selectOptionColumns: {
    historyid: "sih_historyid",
    detailid: "sih_detailid",
    date: "sih_date",
    productid: "sih_productid",
    branch: "sih_branch",
    quantity: "sih_quantity"
  },
  updateOptionColumns: {
    historyid: "historyid",
    detailid: "detailid",
    date: "date",
    productid: "productid",
    branch: "branch",
    quantity: "quantity"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  sales_promo: {
  tablename: "sales_promo",
  prefix: "sp",
  prefix_: "sp_",
  insertColumns: [
      "promoid",
      "detailid"
    ],
  selectColumns: [
      "sp_id",
      "sp_promoid",
      "sp_detailid"
    ],
  selectOptionColumns: {
    id: "sp_id",
    promoid: "sp_promoid",
    detailid: "sp_detailid"
  },
  updateOptionColumns: {
    id: "id",
    promoid: "promoid",
    detailid: "detailid"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  sales_discount: {
  tablename: "sales_discount",
  prefix: "sd",
  prefix_: "sd_",
  insertColumns: [
      "detailid",
      "discountid",
      "customerinfo",
      "amount"
    ],
  selectColumns: [
      "sd_id",
      "sd_detailid",
      "sd_discountid",
      "sd_customerinfo",
      "sd_amount"
    ],
  selectOptionColumns: {
    id: "sd_id",
    detailid: "sd_detailid",
    discountid: "sd_discountid",
    customerinfo: "sd_customerinfo",
    amount: "sd_amount"
  },
  updateOptionColumns: {
    id: "id",
    detailid: "detailid",
    discountid: "discountid",
    customerinfo: "customerinfo",
    amount: "amount"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  sales_purchase_order: {
  tablename: "sales_purchase_order",
  prefix: "ct",
  prefix_: "ct_",
  insertColumns: [
      "reference_id",
      "sales_id",
      "branch_id",
      "pos_id"
    ],
  selectColumns: [
      "ct_reference_id",
      "ct_sales_id",
      "ct_branch_id",
      "ct_pos_id"
    ],
  selectOptionColumns: {
    reference_id: "ct_reference_id",
    sales_id: "ct_sales_id",
    branch_id: "ct_branch_id",
    pos_id: "ct_pos_id"
  },
  updateOptionColumns: {
    reference_id: "reference_id",
    sales_id: "sales_id",
    branch_id: "branch_id",
    pos_id: "pos_id"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Sale = Sale;