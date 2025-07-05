const Transfer = {
  transfer_order_items: {
    tablename: 'transfer_order_items',
    prefix: 'toi',
    prefix_: 'toi_',
    selectColums: [
      `toi_itemid`,
      `toi_transferid`,
      `toi_productid`,
      `toi_quantity`,
      `toi_destinationStocks`,
    ],
    insertColumns: [`transferid`, `productid`, `quantity`, `destinationstocks`],
    selectOptionColumn: {
      itemid: 'toi_itemid',
      transferid: 'toi_transferid',
      productid: 'toi_productid',
      quantity: 'toi_quantity',
      destinationstocks: 'toi_destinationstocks',
    },
  },
  transfer_orders: {
    tablename: 'transfer_orders',
    prefix: 'to',
    prefix_: 'to_',
    selectColums: [
      `to_transferid`,
      `to_fromlocationid`,
      `to_tolocationid`,
      `to_transferdate`,
      `to_totalquantity`,
      `to_status`,
      `to_notes`,
    ],
  },
}
