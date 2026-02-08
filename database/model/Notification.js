const Notification = {
  notification: {
  tablename: "notification",
  prefix: "n",
  prefix_: "n_",
  insertColumns: [
      "userid",
      "inventoryid",
      "branchid",
      "quantity",
      "message",
      "status",
      "checker",
      "date"
    ],
  selectColumns: [
      "n_id",
      "n_userid",
      "n_inventoryid",
      "n_branchid",
      "n_quantity",
      "n_message",
      "n_status",
      "n_checker",
      "n_date"
    ],
  selectOptionColumns: {
    id: "n_id",
    userid: "n_userid",
    inventoryid: "n_inventoryid",
    branchid: "n_branchid",
    quantity: "n_quantity",
    message: "n_message",
    status: "n_status",
    checker: "n_checker",
    date: "n_date"
  },
  updateOptionColumns: {
    id: "id",
    userid: "userid",
    inventoryid: "inventoryid",
    branchid: "branchid",
    quantity: "quantity",
    message: "message",
    status: "status",
    checker: "checker",
    date: "date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Notification = Notification;