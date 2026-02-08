const Addon = {
  addon_type: {
  tablename: "addon_type",
  prefix: "at",
  prefix_: "at_",
  insertColumns: [
      "name",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "at_id",
      "at_name",
      "at_status",
      "at_createdby",
      "at_createddate"
    ],
  selectOptionColumns: {
    id: "at_id",
    name: "at_name",
    status: "at_status",
    createdby: "at_createdby",
    createddate: "at_createddate"
  },
  updateOptionColumns: {
    id: "id",
    name: "name",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  addon: {
  tablename: "addon",
  prefix: "a",
  prefix_: "a_",
  insertColumns: [
      "name",
      "type",
      "price",
      "isproduct",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "a_id",
      "a_name",
      "a_type",
      "a_price",
      "a_isproduct",
      "a_status",
      "a_createdby",
      "a_createddate"
    ],
  selectOptionColumns: {
    id: "a_id",
    name: "a_name",
    type: "a_type",
    price: "a_price",
    isproduct: "a_isproduct",
    status: "a_status",
    createdby: "a_createdby",
    createddate: "a_createddate"
  },
  updateOptionColumns: {
    id: "id",
    name: "name",
    type: "type",
    price: "price",
    isproduct: "isproduct",
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

exports.Addon = Addon;