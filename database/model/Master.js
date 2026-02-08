const Master = {
  master_branch: {
  tablename: "master_branch",
  prefix: "mb",
  prefix_: "mb_",
  insertColumns: [
      "branchid",
      "branchname",
      "tin",
      "address",
      "logo",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mb_branchid",
      "mb_branchname",
      "mb_tin",
      "mb_address",
      "mb_logo",
      "mb_status",
      "mb_createdby",
      "mb_createddate"
    ],
  selectOptionColumns: {
    branchid: "mb_branchid",
    branchname: "mb_branchname",
    tin: "mb_tin",
    address: "mb_address",
    logo: "mb_logo",
    status: "mb_status",
    createdby: "mb_createdby",
    createddate: "mb_createddate"
  },
  updateOptionColumns: {
    branchid: "branchid",
    branchname: "branchname",
    tin: "tin",
    address: "address",
    logo: "logo",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_access_type: {
  tablename: "master_access_type",
  prefix: "mat",
  prefix_: "mat_",
  insertColumns: [
      "accessname",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mat_accesscode",
      "mat_accessname",
      "mat_status",
      "mat_createdby",
      "mat_createddate"
    ],
  selectOptionColumns: {
    accesscode: "mat_accesscode",
    accessname: "mat_accessname",
    status: "mat_status",
    createdby: "mat_createdby",
    createddate: "mat_createddate"
  },
  updateOptionColumns: {
    accesscode: "accesscode",
    accessname: "accessname",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_denomination: {
  tablename: "master_denomination",
  prefix: "md",
  prefix_: "md_",
  insertColumns: [
      "code",
      "description",
      "value",
      "status",
      "create_by",
      "create_date"
    ],
  selectColumns: [
      "md_id",
      "md_code",
      "md_description",
      "md_value",
      "md_status",
      "md_create_by",
      "md_create_date"
    ],
  selectOptionColumns: {
    id: "md_id",
    code: "md_code",
    description: "md_description",
    value: "md_value",
    status: "md_status",
    create_by: "md_create_by",
    create_date: "md_create_date"
  },
  updateOptionColumns: {
    id: "id",
    code: "code",
    description: "description",
    value: "value",
    status: "status",
    create_by: "create_by",
    create_date: "create_date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_location: {
  tablename: "master_location",
  prefix: "ml",
  prefix_: "ml_",
  insertColumns: [
      "locationname",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "ml_locationid",
      "ml_locationname",
      "ml_status",
      "ml_createdby",
      "ml_createddate"
    ],
  selectOptionColumns: {
    locationid: "ml_locationid",
    locationname: "ml_locationname",
    status: "ml_status",
    createdby: "ml_createdby",
    createddate: "ml_createddate"
  },
  updateOptionColumns: {
    locationid: "locationid",
    locationname: "locationname",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_material_cost: {
  tablename: "master_material_cost",
  prefix: "mmc",
  prefix_: "mmc_",
  insertColumns: [
      "materialname",
      "unitcost",
      "unit",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mmc_materialid",
      "mmc_materialname",
      "mmc_unitcost",
      "mmc_unit",
      "mmc_status",
      "mmc_createdby",
      "mmc_createddate"
    ],
  selectOptionColumns: {
    materialid: "mmc_materialid",
    materialname: "mmc_materialname",
    unitcost: "mmc_unitcost",
    unit: "mmc_unit",
    status: "mmc_status",
    createdby: "mmc_createdby",
    createddate: "mmc_createddate"
  },
  updateOptionColumns: {
    materialid: "materialid",
    materialname: "materialname",
    unitcost: "unitcost",
    unit: "unit",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_payment: {
  tablename: "master_payment",
  prefix: "mp",
  prefix_: "mp_",
  insertColumns: [
      "paymentname",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mp_paymentid",
      "mp_paymentname",
      "mp_status",
      "mp_createdby",
      "mp_createddate"
    ],
  selectOptionColumns: {
    paymentid: "mp_paymentid",
    paymentname: "mp_paymentname",
    status: "mp_status",
    createdby: "mp_createdby",
    createddate: "mp_createddate"
  },
  updateOptionColumns: {
    paymentid: "paymentid",
    paymentname: "paymentname",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_pos: {
  tablename: "master_pos",
  prefix: "mp",
  prefix_: "mp_",
  insertColumns: [
      "posname",
      "serial",
      "min",
      "ptu",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mp_posid",
      "mp_posname",
      "mp_serial",
      "mp_min",
      "mp_ptu",
      "mp_status",
      "mp_createdby",
      "mp_createddate"
    ],
  selectOptionColumns: {
    posid: "mp_posid",
    posname: "mp_posname",
    serial: "mp_serial",
    min: "mp_min",
    ptu: "mp_ptu",
    status: "mp_status",
    createdby: "mp_createdby",
    createddate: "mp_createddate"
  },
  updateOptionColumns: {
    posid: "posid",
    posname: "posname",
    serial: "serial",
    min: "min",
    ptu: "ptu",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_position_type: {
  tablename: "master_position_type",
  prefix: "mpt",
  prefix_: "mpt_",
  insertColumns: [
      "positionname",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mpt_positioncode",
      "mpt_positionname",
      "mpt_status",
      "mpt_createdby",
      "mpt_createddate"
    ],
  selectOptionColumns: {
    positioncode: "mpt_positioncode",
    positionname: "mpt_positionname",
    status: "mpt_status",
    createdby: "mpt_createdby",
    createddate: "mpt_createddate"
  },
  updateOptionColumns: {
    positioncode: "positioncode",
    positionname: "positionname",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_category: {
  tablename: "master_category",
  prefix: "mc",
  prefix_: "mc_",
  insertColumns: [
      "categoryname",
      "status",
      "createdby",
      "createddate",
      "is_display"
    ],
  selectColumns: [
      "mc_categorycode",
      "mc_categoryname",
      "mc_status",
      "mc_createdby",
      "mc_createddate",
      "mc_is_display"
    ],
  selectOptionColumns: {
    categorycode: "mc_categorycode",
    categoryname: "mc_categoryname",
    status: "mc_status",
    createdby: "mc_createdby",
    createddate: "mc_createddate",
    is_display: "mc_is_display"
  },
  updateOptionColumns: {
    categorycode: "categorycode",
    categoryname: "categoryname",
    status: "status",
    createdby: "createdby",
    createddate: "createddate",
    is_display: "is_display"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_product: {
  tablename: "master_product",
  prefix: "mp",
  prefix_: "mp_",
  insertColumns: [
      "description",
      "price",
      "category",
      "barcode",
      "productimage",
      "status",
      "createdby",
      "createddate",
      "cost"
    ],
  selectColumns: [
      "mp_productid",
      "mp_description",
      "mp_price",
      "mp_category",
      "mp_barcode",
      "mp_productimage",
      "mp_status",
      "mp_createdby",
      "mp_createddate",
      "mp_cost"
    ],
  selectOptionColumns: {
    productid: "mp_productid",
    description: "mp_description",
    price: "mp_price",
    category: "mp_category",
    barcode: "mp_barcode",
    productimage: "mp_productimage",
    status: "mp_status",
    createdby: "mp_createdby",
    createddate: "mp_createddate",
    cost: "mp_cost"
  },
  updateOptionColumns: {
    productid: "productid",
    description: "description",
    price: "price",
    category: "category",
    barcode: "barcode",
    productimage: "productimage",
    status: "status",
    createdby: "createdby",
    createddate: "createddate",
    cost: "cost"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_vendor: {
  tablename: "master_vendor",
  prefix: "mv",
  prefix_: "mv_",
  insertColumns: [
      "vendorname",
      "contactname",
      "contactnumber",
      "contactemail",
      "contactphone",
      "address",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mv_vendorid",
      "mv_vendorname",
      "mv_contactname",
      "mv_contactnumber",
      "mv_contactemail",
      "mv_contactphone",
      "mv_address",
      "mv_status",
      "mv_createdby",
      "mv_createddate"
    ],
  selectOptionColumns: {
    vendorid: "mv_vendorid",
    vendorname: "mv_vendorname",
    contactname: "mv_contactname",
    contactnumber: "mv_contactnumber",
    contactemail: "mv_contactemail",
    contactphone: "mv_contactphone",
    address: "mv_address",
    status: "mv_status",
    createdby: "mv_createdby",
    createddate: "mv_createddate"
  },
  updateOptionColumns: {
    vendorid: "vendorid",
    vendorname: "vendorname",
    contactname: "contactname",
    contactnumber: "contactnumber",
    contactemail: "contactemail",
    contactphone: "contactphone",
    address: "address",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_user: {
  tablename: "master_user",
  prefix: "mu",
  prefix_: "mu_",
  insertColumns: [
      "employeeid",
      "accesstype",
      "status",
      "username",
      "password",
      "branchid",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mu_usercode",
      "mu_employeeid",
      "mu_accesstype",
      "mu_status",
      "mu_username",
      "mu_password",
      "mu_branchid",
      "mu_createdby",
      "mu_createddate"
    ],
  selectOptionColumns: {
    usercode: "mu_usercode",
    employeeid: "mu_employeeid",
    accesstype: "mu_accesstype",
    status: "mu_status",
    username: "mu_username",
    password: "mu_password",
    branchid: "mu_branchid",
    createdby: "mu_createdby",
    createddate: "mu_createddate"
  },
  updateOptionColumns: {
    usercode: "usercode",
    employeeid: "employeeid",
    accesstype: "accesstype",
    status: "status",
    username: "username",
    password: "password",
    branchid: "branchid",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  master_employees: {
  tablename: "master_employees",
  prefix: "me",
  prefix_: "me_",
  insertColumns: [
      "fullname",
      "position",
      "contactinfo",
      "datehired",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "me_employeeid",
      "me_fullname",
      "me_position",
      "me_contactinfo",
      "me_datehired",
      "me_status",
      "me_createdby",
      "me_createddate"
    ],
  selectOptionColumns: {
    employeeid: "me_employeeid",
    fullname: "me_fullname",
    position: "me_position",
    contactinfo: "me_contactinfo",
    datehired: "me_datehired",
    status: "me_status",
    createdby: "me_createdby",
    createddate: "me_createddate"
  },
  updateOptionColumns: {
    employeeid: "employeeid",
    fullname: "fullname",
    position: "position",
    contactinfo: "contactinfo",
    datehired: "datehired",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Master = Master;