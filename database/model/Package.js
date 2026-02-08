const Package = {
  package: {
  tablename: "package",
  prefix: "p",
  prefix_: "p_",
  insertColumns: [
      "name",
      "details",
      "price",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "p_id",
      "p_name",
      "p_details",
      "p_price",
      "p_status",
      "p_createdby",
      "p_createddate"
    ],
  selectOptionColumns: {
    id: "p_id",
    name: "p_name",
    details: "p_details",
    price: "p_price",
    status: "p_status",
    createdby: "p_createdby",
    createddate: "p_createddate"
  },
  updateOptionColumns: {
    id: "id",
    name: "name",
    details: "details",
    price: "price",
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

exports.Package = Package;