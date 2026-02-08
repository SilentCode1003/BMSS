const Epayment = {
  epayment_details: {
  tablename: "epayment_details",
  prefix: "ed",
  prefix_: "ed_",
  insertColumns: [
      "detailid",
      "type",
      "referenceid",
      "date"
    ],
  selectColumns: [
      "ed_paymentid",
      "ed_detailid",
      "ed_type",
      "ed_referenceid",
      "ed_date"
    ],
  selectOptionColumns: {
    paymentid: "ed_paymentid",
    detailid: "ed_detailid",
    type: "ed_type",
    referenceid: "ed_referenceid",
    date: "ed_date"
  },
  updateOptionColumns: {
    paymentid: "paymentid",
    detailid: "detailid",
    type: "type",
    referenceid: "referenceid",
    date: "date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Epayment = Epayment;