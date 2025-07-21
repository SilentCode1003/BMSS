const History = {
  history: {
    tablename: 'history',
    prefix: 'h',
    prefix_: 'h_',
    selectColums: [
      `h_id`,
      `h_branch`,
      `h_quantity`,
      `h_date`,
      `h_productid`,
      `h_inventoryid`,
      `h_movementid`,
      `h_type`,
      `h_stocksafter`,
    ],
    insertColumns: [
      `branch`,
      `quantity`,
      `date`,
      `productid`,
      `inventoryid`,
      `movementid`,
      `type`,
      `stocksafter`,
    ],
    selectOptionColumn: {
      id: 'h_id',
      branch: 'h_branch',
      quantity: 'h_quantity',
      date: 'h_date',
      productid: 'h_productid',
      inventoryid: 'h_inventoryid',
      movementid: 'h_movementid',
      type: 'h_type',
      stocksafter: 'h_stocksafter',
    },
  },
}

exports.History = History
