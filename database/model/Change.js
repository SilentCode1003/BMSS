const Change = {
  change_activity: {
  tablename: "change_activity",
  prefix: "ca",
  prefix_: "ca_",
  insertColumns: [
      "detail_id",
      "total_amount",
      "cash_tender",
      "change"
    ],
  selectColumns: [
      "ca_id",
      "ca_detail_id",
      "ca_total_amount",
      "ca_cash_tender",
      "ca_change"
    ],
  selectOptionColumns: {
    id: "ca_id",
    detail_id: "ca_detail_id",
    total_amount: "ca_total_amount",
    cash_tender: "ca_cash_tender",
    change: "ca_change"
  },
  updateOptionColumns: {
    id: "id",
    detail_id: "detail_id",
    total_amount: "total_amount",
    cash_tender: "cash_tender",
    change: "change"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Change = Change;