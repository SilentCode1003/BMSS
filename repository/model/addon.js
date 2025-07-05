const Addon = {
  addon: {
    tablename: 'addon',
    prefix: 'a',
    prefix_: 'a_',
    selectColums: [
      `a_id`,
      `a_name`,
      `a_type`,
      `a_price`,
      `a_isproduct`,
      `a_status`,
      `a_createdby`,
      `a_createddate`,
    ],
    insertColumns: [`name`, `type`, `price`, `isproduct`, `status`, `createdby`, `createddate`],
    selectOptionColumn: {
      id: 'a_id',
      name: 'a_name',
      type: 'a_type',
      price: 'a_price',
      isproduct: 'a_isproduct',
      status: 'a_status',
      createdby: 'a_createdby',
      createddate: 'a_createddate',
    },
  },
  addon_type: {
    tablename: 'addon_type',
    prefix: 'at',
    prefix_: 'at_',
    selectColums: [`at_id`, `at_name`, `at_status`, `at_createdby`, `at_createddate`],
    insertColumns: [`name`, `status`, `createdby`, `createddate`],
    selectOptionColumn: {
      id: 'at_id',
      name: 'at_name',
      status: 'at_status',
      createdby: 'at_createdby',
      createddate: 'at_createddate',
    },
  },
}

exports.Addon = Addon
