const Discount = {
  discounts_details: {
    tablename: 'discounts_details',
    prefix: 'dd',
    prefix_: 'dd_',
    selectColums: [
      `dd_discountid`,
      `dd_name`,
      `dd_description`,
      `dd_rate`,
      `dd_status`,
      `dd_createdby`,
      `dd_createddate`,
    ],
    insertColumns: [`name`, `description`, `rate`, `status`, `createdby`, `createddate`],
    selectOptionColumn: {
      discountid: 'dd_discountid',
      name: 'dd_name',
      description: 'dd_description',
      rate: 'dd_rate',
      status: 'dd_status',
      createdby: 'dd_createdby',
      createddate: 'dd_createddate',
    },
  },
}

exports.Discount = Discount
