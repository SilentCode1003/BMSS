const Package = {
  package: {
    tablename: 'package',
    prefix: 'p',
    prefix_: 'p_',
    selectColums: [
      `p_id`,
      `p_name`,
      `p_details`,
      `p_price`,
      `p_status`,
      `p_createdby`,
      `p_createddate`,
    ],
    insertColumns: [`name`, `details`, `price`, `status`, `createdby`, `createddate`],
    selectOptionColumn: {
      id: 'p_id',
      name: 'p_name',
      details: 'p_details',
      price: 'p_price',
      status: 'p_status',
      createdby: 'p_createdby',
      createddate: 'p_createddate',
    },
  },
}

exports.Package = Package
