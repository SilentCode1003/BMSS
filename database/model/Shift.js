const Shift = {
  shift_report: {
  tablename: "shift_report",
  prefix: "sr",
  prefix_: "sr_",
  insertColumns: [
      "date",
      "pos",
      "shift",
      "cashier",
      "floating",
      "cash_float",
      "sales_beginning",
      "sales_ending",
      "total_sales",
      "receipt_beginning",
      "receipt_ending",
      "status",
      "approvedby",
      "approveddate"
    ],
  selectColumns: [
      "sr_date",
      "sr_pos",
      "sr_shift",
      "sr_cashier",
      "sr_floating",
      "sr_cash_float",
      "sr_sales_beginning",
      "sr_sales_ending",
      "sr_total_sales",
      "sr_receipt_beginning",
      "sr_receipt_ending",
      "sr_status",
      "sr_approvedby",
      "sr_approveddate"
    ],
  selectOptionColumns: {
    date: "sr_date",
    pos: "sr_pos",
    shift: "sr_shift",
    cashier: "sr_cashier",
    floating: "sr_floating",
    cash_float: "sr_cash_float",
    sales_beginning: "sr_sales_beginning",
    sales_ending: "sr_sales_ending",
    total_sales: "sr_total_sales",
    receipt_beginning: "sr_receipt_beginning",
    receipt_ending: "sr_receipt_ending",
    status: "sr_status",
    approvedby: "sr_approvedby",
    approveddate: "sr_approveddate"
  },
  updateOptionColumns: {
    date: "date",
    pos: "pos",
    shift: "shift",
    cashier: "cashier",
    floating: "floating",
    cash_float: "cash_float",
    sales_beginning: "sales_beginning",
    sales_ending: "sales_ending",
    total_sales: "total_sales",
    receipt_beginning: "receipt_beginning",
    receipt_ending: "receipt_ending",
    status: "status",
    approvedby: "approvedby",
    approveddate: "approveddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Shift = Shift;