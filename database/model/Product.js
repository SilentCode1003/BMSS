const Product = {
  product_component: {
  tablename: "product_component",
  prefix: "pc",
  prefix_: "pc_",
  insertColumns: [
      "productid",
      "components",
      "totalcost",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "pc_componentid",
      "pc_productid",
      "pc_components",
      "pc_totalcost",
      "pc_status",
      "pc_createdby",
      "pc_createddate"
    ],
  selectOptionColumns: {
    componentid: "pc_componentid",
    productid: "pc_productid",
    components: "pc_components",
    totalcost: "pc_totalcost",
    status: "pc_status",
    createdby: "pc_createdby",
    createddate: "pc_createddate"
  },
  updateOptionColumns: {
    componentid: "componentid",
    productid: "productid",
    components: "components",
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
  product_inventory: {
  tablename: "product_inventory",
  prefix: "pi",
  prefix_: "pi_",
  insertColumns: [
      "productid",
      "branchid",
      "quantity",
      "category"
    ],
  selectColumns: [
      "pi_inventoryid",
      "pi_productid",
      "pi_branchid",
      "pi_quantity",
      "pi_category"
    ],
  selectOptionColumns: {
    inventoryid: "pi_inventoryid",
    productid: "pi_productid",
    branchid: "pi_branchid",
    quantity: "pi_quantity",
    category: "pi_category"
  },
  updateOptionColumns: {
    inventoryid: "inventoryid",
    productid: "productid",
    branchid: "branchid",
    quantity: "quantity",
    category: "category"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  product_price: {
  tablename: "product_price",
  prefix: "pp",
  prefix_: "pp_",
  insertColumns: [
      "product_id",
      "description",
      "barcode",
      "product_image",
      "price",
      "category",
      "previous_price",
      "price_change",
      "price_change_date",
      "status",
      "createdby",
      "createddate"
    ],
  selectColumns: [
      "pp_product_price_id",
      "pp_product_id",
      "pp_description",
      "pp_barcode",
      "pp_product_image",
      "pp_price",
      "pp_category",
      "pp_previous_price",
      "pp_price_change",
      "pp_price_change_date",
      "pp_status",
      "pp_createdby",
      "pp_createddate"
    ],
  selectOptionColumns: {
    product_price_id: "pp_product_price_id",
    product_id: "pp_product_id",
    description: "pp_description",
    barcode: "pp_barcode",
    product_image: "pp_product_image",
    price: "pp_price",
    category: "pp_category",
    previous_price: "pp_previous_price",
    price_change: "pp_price_change",
    price_change_date: "pp_price_change_date",
    status: "pp_status",
    createdby: "pp_createdby",
    createddate: "pp_createddate"
  },
  updateOptionColumns: {
    product_price_id: "product_price_id",
    product_id: "product_id",
    description: "description",
    barcode: "barcode",
    product_image: "product_image",
    price: "price",
    category: "category",
    previous_price: "previous_price",
    price_change: "price_change",
    price_change_date: "price_change_date",
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

exports.Product = Product;