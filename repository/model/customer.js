const Customer = {
  customer_info: {
    tablename: 'customer_info',
    prefix: 'ci',
    prefix_: 'ci_',
    insertColumns: ['type', 'company', 'fullname', 'email', 'phone', 'mobile', 'address', 'create_at', 'create_by'],
    selectColumns: [
      'ci_id',
      'ci_type',
      'ci_company',
      'ci_fullname',
      'ci_email',
      'ci_phone',
      'ci_mobile',
      'ci_address',
      'ci_create_at',
      'ci_create_by',
    ],
    selectOptionsColumns: {
      id: 'ci_id',
      type: 'ci_type',
      company: 'ci_company',
      fullname: 'ci_fullname',
      email: 'ci_email',
      phone: 'ci_phone',
      mobile: 'ci_mobile',
      address: 'ci_address',
      create_at: 'ci_create_at',
      create_by: 'ci_create_by',
    },
  },
  customer_transaction: {
    tablename: 'customer_transaction',
    prefix: 'ct',
    prefix_: 'ct_',
    insertColumns: ['customer_id', 'sales_id', 'status', 'create_at'],
    selectColumns: ['ct_id', 'ct_customer_id', 'ct_sales_id', 'ct_status', 'ct_create_at'],
    selectOptionsColumns: {
      id: 'ct_id',
      customer_id: 'ct_customer_id',
      sales_id: 'ct_sales_id',
      status: 'ct_status',
      create_at: 'ct_create_at',
    },
  },
}

exports.Customer = Customer
