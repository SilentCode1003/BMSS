const Notification = {
  notification: {
    tablename: 'notification',
    prefix: 'n',
    prefix_: 'n_',
    selectColums: [
      `n_id`,
      `n_userid`,
      `n_inventoryid`,
      `n_branchid`,
      `n_quantity`,
      `n_message`,
      `n_status`,
      `n_checker`,
      `n_date`,
    ],
    insertColumns: [
      `userid`,
      `inventoryid`,
      `branchid`,
      `quantity`,
      `message`,
      `status`,
      `checker`,
      `date`,
    ],
    selectOptionColumn: {
      id: 'n_id',
      userid: 'n_userid',
      inventoryid: 'n_inventoryid',
      branchid: 'n_branchid',
      quantity: 'n_quantity',
      message: 'n_message',
      status: 'n_status',
      checker: 'n_checker',
      date: 'n_date',
    },
  },
}

exports.Notification = Notification
