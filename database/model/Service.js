const Service = {
  services: {
  tablename: "services",
  prefix: "s",
  prefix_: "s_",
  insertColumns: [
      "name",
      "price",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "s_id",
      "s_name",
      "s_price",
      "s_status",
      "s_createdby",
      "s_createddate"
    ],
  selectOptionColumns: {
    id: "s_id",
    name: "s_name",
    price: "s_price",
    status: "s_status",
    createdby: "s_createdby",
    createddate: "s_createddate"
  },
  updateOptionColumns: {
    id: "id",
    name: "name",
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

exports.Service = Service;