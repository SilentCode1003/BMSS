const Price = {
  price_change: {
    tablename: 'price_change',
    prefix: 'pc',
    prefix_: 'pc_',
    selectColums: [
      `pc_price_change_id`,
      `pc_product_id`,
      `pc_price`,
      `pc_status`,
      `pc_createdby`,
      `pc_createddate`,
    ],
    insertColumns: [`product_id`, `price`, `status`, `createdby`, `createddate`],
    selectOptionColumn: {
      price_change_id: 'pc_price_change_id',
      product_id: 'pc_product_id',
      price: 'pc_price',
      status: 'pc_status',
      createdby: 'pc_createdby',
      createddate: 'pc_createddate',
    },
  },
}

exports.Price = Price
