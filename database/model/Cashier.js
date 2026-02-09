const Cashier = {
  cashier_activity: {
  tablename: "cashier_activity",
  prefix: "ca",
  prefix_: "ca_",
  insertColumns: [
      "detailid",
      "paymenttype",
      "amount",
      "date"
    ],
  selectColumns: [
      "ca_activityid",
      "ca_detailid",
      "ca_paymenttype",
      "ca_amount",
      "ca_date"
    ],
  selectOptionColumns: {
    activityid: "ca_activityid",
    detailid: "ca_detailid",
    paymenttype: "ca_paymenttype",
    amount: "ca_amount",
    date: "ca_date"
  },
  updateOptionColumns: {
    activityid: "activityid",
    detailid: "detailid",
    paymenttype: "paymenttype",
    amount: "amount",
    date: "date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Cashier = Cashier;