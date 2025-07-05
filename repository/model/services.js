const Services = {
  services: {
    tablename: 'services',
    prefix: 's',
    prefix_: 's_',
    selectColums: [`s_id`, `s_name`, `s_price`, `s_status`, `s_createdby`, `s_createddate`],
    insertColumns: [`name`, `price`, `status`, `createdby`, `createddate`],
    selectOptionColumn: {
      id: 's_id',
      name: 's_name',
      price: 's_price',
      status: 's_status',
      createdby: 's_createdby',
      createddate: 's_createddate',
    },
  },
}

exports.Services = Services
