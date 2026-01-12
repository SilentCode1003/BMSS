const Production = {
  production_materials: {
  tablename: "production_materials",
  prefix: "mpm",
  prefix_: "mpm_",
  insertColumns: [
      "productname",
      "description",
      "category",
      "vendorid",
      "price",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "mpm_productid",
      "mpm_productname",
      "mpm_description",
      "mpm_category",
      "mpm_vendorid",
      "mpm_price",
      "mpm_status",
      "mpm_createdby",
      "mpm_createddate"
    ],
  selectOptionColumns: {
    productid: "mpm_productid",
    productname: "mpm_productname",
    description: "mpm_description",
    category: "mpm_category",
    vendorid: "mpm_vendorid",
    price: "mpm_price",
    status: "mpm_status",
    createdby: "mpm_createdby",
    createddate: "mpm_createddate"
  },
  updateOptionColumns: {
    productid: "productid",
    productname: "productname",
    description: "description",
    category: "category",
    vendorid: "vendorid",
    price: "price",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_material_count: {
  tablename: "production_material_count",
  prefix: "pmc",
  prefix_: "pmc_",
  insertColumns: [
      "productid",
      "quantity",
      "unit",
      "status",
      "createdby",
      "createdby",
      "updatedby"
    ],
  selectColumns: [
      "pmc_countid",
      "pmc_productid",
      "pmc_quantity",
      "pmc_unit",
      "pmc_status",
      "mpm_createdby",
      "mpm_createdby",
      "mpm_updatedby"
    ],
  selectOptionColumns: {
    countid: "pmc_countid",
    productid: "pmc_productid",
    quantity: "pmc_quantity",
    unit: "pmc_unit",
    status: "pmc_status",
    createdby: "mpm_createdby",
    updatedby: "mpm_updatedby"
  },
  updateOptionColumns: {
    countid: "countid",
    productid: "productid",
    quantity: "quantity",
    unit: "unit",
    status: "status",
    createdby: "createdby",
    updatedby: "updatedby"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_material_history: {
  tablename: "production_material_history",
  prefix: "pmh",
  prefix_: "pmh_",
  insertColumns: [
      "countId",
      "baseQuantity",
      "movementUnit",
      "baseUnit",
      "convertedQuantity",
      "movementId",
      "type",
      "date",
      "stocksBefore",
      "stocksAfter",
      "unitBefore",
      "unitAfter"
    ],
  selectColumns: [
      "pmh_id",
      "pmh_countId",
      "pmh_baseQuantity",
      "pmh_movementUnit",
      "pmh_baseUnit",
      "pmh_convertedQuantity",
      "pmh_movementId",
      "pmh_type",
      "pmh_date",
      "pmh_stocksBefore",
      "pmh_stocksAfter",
      "pmh_unitBefore",
      "pmh_unitAfter"
    ],
  selectOptionColumns: {
    id: "pmh_id",
    countId: "pmh_countId",
    baseQuantity: "pmh_baseQuantity",
    movementUnit: "pmh_movementUnit",
    baseUnit: "pmh_baseUnit",
    convertedQuantity: "pmh_convertedQuantity",
    movementId: "pmh_movementId",
    type: "pmh_type",
    date: "pmh_date",
    stocksBefore: "pmh_stocksBefore",
    stocksAfter: "pmh_stocksAfter",
    unitBefore: "pmh_unitBefore",
    unitAfter: "pmh_unitAfter"
  },
  updateOptionColumns: {
    id: "id",
    countId: "countId",
    baseQuantity: "baseQuantity",
    movementUnit: "movementUnit",
    baseUnit: "baseUnit",
    convertedQuantity: "convertedQuantity",
    movementId: "movementId",
    type: "type",
    date: "date",
    stocksBefore: "stocksBefore",
    stocksAfter: "stocksAfter",
    unitBefore: "unitBefore",
    unitAfter: "unitAfter"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_material_stock_adjustment: {
  tablename: "production_material_stock_adjustment",
  prefix: "pmsa",
  prefix_: "pmsa_",
  insertColumns: [
      "date",
      "note",
      "content",
      "status"
    ],
  selectColumns: [
      "pmsa_id",
      "pmsa_date",
      "pmsa_note",
      "pmsa_content",
      "pmsa_status"
    ],
  selectOptionColumns: {
    id: "pmsa_id",
    date: "pmsa_date",
    note: "pmsa_note",
    content: "pmsa_content",
    status: "pmsa_status"
  },
  updateOptionColumns: {
    id: "id",
    date: "date",
    note: "note",
    content: "content",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_components: {
  tablename: "production_components",
  prefix: "pc",
  prefix_: "pc_",
  insertColumns: [
      "productid",
      "details",
      "totalcost",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "pc_componentid",
      "pc_productid",
      "pc_details",
      "pc_totalcost",
      "pc_status",
      "pc_createdby",
      "pc_createddate"
    ],
  selectOptionColumns: {
    componentid: "pc_componentid",
    productid: "pc_productid",
    details: "pc_details",
    totalcost: "pc_totalcost",
    status: "pc_status",
    createdby: "pc_createdby",
    createddate: "pc_createddate"
  },
  updateOptionColumns: {
    componentid: "componentid",
    productid: "productid",
    details: "details",
    totalcost: "totalcost",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production: {
  tablename: "production",
  prefix: "p",
  prefix_: "p_",
  insertColumns: [
      "productid",
      "startdate",
      "enddate",
      "quantityproduced",
      "productionline",
      "supervisorid",
      "notes",
      "status"
    ],
  selectColumns: [
      "p_productionid",
      "p_productid",
      "p_startdate",
      "p_enddate",
      "p_quantityproduced",
      "p_productionline",
      "p_supervisorid",
      "p_notes",
      "p_status"
    ],
  selectOptionColumns: {
    productionid: "p_productionid",
    productid: "p_productid",
    startdate: "p_startdate",
    enddate: "p_enddate",
    quantityproduced: "p_quantityproduced",
    productionline: "p_productionline",
    supervisorid: "p_supervisorid",
    notes: "p_notes",
    status: "p_status"
  },
  updateOptionColumns: {
    productionid: "productionid",
    productid: "productid",
    startdate: "startdate",
    enddate: "enddate",
    quantityproduced: "quantityproduced",
    productionline: "productionline",
    supervisorid: "supervisorid",
    notes: "notes",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_activities: {
  tablename: "production_activities",
  prefix: "pa",
  prefix_: "pa_",
  insertColumns: [
      "productionid",
      "activityname",
      "startdate",
      "enddate",
      "workerid"
    ],
  selectColumns: [
      "pa_activityid",
      "pa_productionid",
      "pa_activityname",
      "pa_startdate",
      "pa_enddate",
      "pa_workerid"
    ],
  selectOptionColumns: {
    activityid: "pa_activityid",
    productionid: "pa_productionid",
    activityname: "pa_activityname",
    startdate: "pa_startdate",
    enddate: "pa_enddate",
    workerid: "pa_workerid"
  },
  updateOptionColumns: {
    activityid: "activityid",
    productionid: "productionid",
    activityname: "activityname",
    startdate: "startdate",
    enddate: "enddate",
    workerid: "workerid"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_inventory: {
  tablename: "production_inventory",
  prefix: "pi",
  prefix_: "pi_",
  insertColumns: [
      "productid",
      "quantity"
    ],
  selectColumns: [
      "pi_inventoryid",
      "pi_productid",
      "pi_quantity"
    ],
  selectOptionColumns: {
    inventoryid: "pi_inventoryid",
    productid: "pi_productid",
    quantity: "pi_quantity"
  },
  updateOptionColumns: {
    inventoryid: "inventoryid",
    productid: "productid",
    quantity: "quantity"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_logs: {
  tablename: "production_logs",
  prefix: "pl",
  prefix_: "pl_",
  insertColumns: [
      "description",
      "status",
      "date"
    ],
  selectColumns: [
      "pl_logid",
      "pl_description",
      "pl_status",
      "pl_date"
    ],
  selectOptionColumns: {
    logid: "pl_logid",
    description: "pl_description",
    status: "pl_status",
    date: "pl_date"
  },
  updateOptionColumns: {
    logid: "logid",
    description: "description",
    status: "status",
    date: "date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_product_cost: {
  tablename: "production_product_cost",
  prefix: "ppc",
  prefix_: "ppc_",
  insertColumns: [
      "componentid",
      "productid",
      "cost",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "ppc_productionid",
      "ppc_componentid",
      "ppc_productid",
      "ppc_cost",
      "ppc_status",
      "ppc_createdby",
      "ppc_createddate"
    ],
  selectOptionColumns: {
    productionid: "ppc_productionid",
    componentid: "ppc_componentid",
    productid: "ppc_productid",
    cost: "ppc_cost",
    status: "ppc_status",
    createdby: "ppc_createdby",
    createddate: "ppc_createddate"
  },
  updateOptionColumns: {
    productionid: "productionid",
    componentid: "componentid",
    productid: "productid",
    cost: "cost",
    status: "status",
    createdby: "createdby",
    createddate: "createddate"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  production_transfer: {
  tablename: "production_transfer",
  prefix: "pt",
  prefix_: "pt_",
  insertColumns: [
      "productid",
      "quantity",
      "branchid",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "pt_transferid",
      "pt_productid",
      "pt_quantity",
      "pt_branchid",
      "pt_status",
      "pt_createdby",
      "pt_createddate"
    ],
  selectOptionColumns: {
    transferid: "pt_transferid",
    productid: "pt_productid",
    quantity: "pt_quantity",
    branchid: "pt_branchid",
    status: "pt_status",
    createdby: "pt_createdby",
    createddate: "pt_createddate"
  },
  updateOptionColumns: {
    transferid: "transferid",
    productid: "productid",
    quantity: "quantity",
    branchid: "branchid",
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

exports.Production = Production;