const Transfer = {
  transfer_orders: {
  tablename: "transfer_orders",
  prefix: "to",
  prefix_: "to_",
  insertColumns: [
      "fromlocationid",
      "tolocationid",
      "transferdate",
      "totalquantity",
      "status",
      "notes"
    ],
  selectColumns: [
      "to_transferid",
      "to_fromlocationid",
      "to_tolocationid",
      "to_transferdate",
      "to_totalquantity",
      "to_status",
      "to_notes"
    ],
  selectOptionColumns: {
    transferid: "to_transferid",
    fromlocationid: "to_fromlocationid",
    tolocationid: "to_tolocationid",
    transferdate: "to_transferdate",
    totalquantity: "to_totalquantity",
    status: "to_status",
    notes: "to_notes"
  },
  updateOptionColumns: {
    transferid: "transferid",
    fromlocationid: "fromlocationid",
    tolocationid: "tolocationid",
    transferdate: "transferdate",
    totalquantity: "totalquantity",
    status: "status",
    notes: "notes"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  transfer_orders_items: {
  tablename: "transfer_orders_items",
  prefix: "toi",
  prefix_: "toi_",
  insertColumns: [
      "transferid",
      "productid",
      "quantity",
      "destinationStocks"
    ],
  selectColumns: [
      "toi_itemid",
      "toi_transferid",
      "toi_productid",
      "toi_quantity",
      "toi_destinationStocks"
    ],
  selectOptionColumns: {
    itemid: "toi_itemid",
    transferid: "toi_transferid",
    productid: "toi_productid",
    quantity: "toi_quantity",
    destinationStocks: "toi_destinationStocks"
  },
  updateOptionColumns: {
    itemid: "itemid",
    transferid: "transferid",
    productid: "productid",
    quantity: "quantity",
    destinationStocks: "destinationStocks"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Transfer = Transfer;