const Refund = {
  refund: {
  tablename: "refund",
  prefix: "r",
  prefix_: "r_",
  insertColumns: [
      "detailid",
      "reason",
      "cashier",
      "date"
    ],
  selectColumns: [
      "r_id",
      "r_detailid",
      "r_reason",
      "r_cashier",
      "r_date"
    ],
  selectOptionColumns: {
    id: "r_id",
    detailid: "r_detailid",
    reason: "r_reason",
    cashier: "r_cashier",
    date: "r_date"
  },
  updateOptionColumns: {
    id: "id",
    detailid: "detailid",
    reason: "reason",
    cashier: "cashier",
    date: "date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Refund = Refund;