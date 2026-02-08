const Discount = {
  discounts_details: {
  tablename: "discounts_details",
  prefix: "dd",
  prefix_: "dd_",
  insertColumns: [
      "name",
      "description",
      "rate",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "dd_discountid",
      "dd_name",
      "dd_description",
      "dd_rate",
      "dd_status",
      "dd_createdby",
      "dd_createddate"
    ],
  selectOptionColumns: {
    discountid: "dd_discountid",
    name: "dd_name",
    description: "dd_description",
    rate: "dd_rate",
    status: "dd_status",
    createdby: "dd_createdby",
    createddate: "dd_createddate"
  },
  updateOptionColumns: {
    discountid: "discountid",
    name: "name",
    description: "description",
    rate: "rate",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Discount = Discount;