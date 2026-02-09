const History = {
  history: {
  tablename: "history",
  prefix: "h",
  prefix_: "h_",
  insertColumns: [
      "branch",
      "quantity",
      "date",
      "productid",
      "inventoryid",
      "movementid",
      "type",
      "stocksafter"
    ],
  selectColumns: [
      "h_id",
      "h_branch",
      "h_quantity",
      "h_date",
      "h_productid",
      "h_inventoryid",
      "h_movementid",
      "h_type",
      "h_stocksafter"
    ],
  selectOptionColumns: {
    id: "h_id",
    branch: "h_branch",
    quantity: "h_quantity",
    date: "h_date",
    productid: "h_productid",
    inventoryid: "h_inventoryid",
    movementid: "h_movementid",
    type: "h_type",
    stocksafter: "h_stocksafter"
  },
  updateOptionColumns: {
    id: "id",
    branch: "branch",
    quantity: "quantity",
    date: "date",
    productid: "productid",
    inventoryid: "inventoryid",
    movementid: "movementid",
    type: "type",
    stocksafter: "stocksafter"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.History = History;