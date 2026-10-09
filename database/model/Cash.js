const Cash = {
  cash_report: {
  tablename: "cash_report",
  prefix: "cr",
  prefix_: "cr_",
  insertColumns: [
      "date",
      "shift",
      "pos",
      "cashier",
      "type",
      "status"
    ],
  selectColumns: [
      "cr_report_id",
      "cr_date",
      "cr_shift",
      "cr_pos",
      "cr_cashier",
      "cr_type",
      "cr_status"
    ],
  selectOptionColumns: {
    report_id: "cr_report_id",
    date: "cr_date",
    shift: "cr_shift",
    pos: "cr_pos",
    cashier: "cr_cashier",
    type: "cr_type",
    status: "cr_status"
  },
  updateOptionColumns: {
    report_id: "report_id",
    date: "date",
    shift: "shift",
    pos: "pos",
    cashier: "cashier",
    type: "type",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  cash_drop: {
  tablename: "cash_drop",
  prefix: "cd",
  prefix_: "cd_",
  insertColumns: [
      "branch_id",
      "shift_number",
      "shift_date",
      "pos_id",
      "user_id",
      "datetime",
      "amount"
    ],
  selectColumns: [
      "cd_id",
      "cd_branch_id",
      "cd_shift_number",
      "cd_shift_date",
      "cd_pos_id",
      "cd_user_id",
      "cd_datetime",
      "cd_amount"
    ],
  selectOptionColumns: {
    id: "cd_id",
    branch_id: "cd_branch_id",
    shift_number: "cd_shift_number",
    shift_date: "cd_shift_date",
    pos_id: "cd_pos_id",
    user_id: "cd_user_id",
    datetime: "cd_datetime",
    amount: "cd_amount"
  },
  updateOptionColumns: {
    id: "id",
    branch_id: "branch_id",
    shift_number: "shift_number",
    shift_date: "shift_date",
    pos_id: "pos_id",
    user_id: "user_id",
    datetime: "datetime",
    amount: "amount"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  cash_deposit_slip_sales: {
  tablename: "cash_deposit_slip_sales",
  prefix: "cdss",
  prefix_: "cdss_",
  insertColumns: [
      "id",
      "branch_id",
      "pos_id",
      "sales_id",
      "bank_name",
      "account_number",
      "amount"
    ],
  selectColumns: [
      "cdss_id",
      "cdss_branch_id",
      "cdss_pos_id",
      "cdss_sales_id",
      "cdss_bank_name",
      "cdss_account_number",
      "cdss_amount",
      "cdss_status"
    ],
  selectOptionColumns: {
    id: "cdss_id",
    branch_id: "cdss_branch_id",
    pos_id: "cdss_pos_id",
    sales_id: "cdss_sales_id",
    bank_name: "cdss_bank_name",
    account_number: "cdss_account_number",
    amount: "cdss_amount",
    status: "cdss_status"
  },
  updateOptionColumns: {
    id: "id",
    branch_id: "branch_id",
    pos_id: "pos_id",
    sales_id: "sales_id",
    bank_name: "bank_name",
    account_number: "account_number",
    amount: "amount",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  cash_deposit_slip_sales_history: {
  tablename: "cash_deposit_slip_sales_history",
  prefix: "cdssh",
  prefix_: "cdssh_",
  insertColumns: [
      "id",
      "cash_deposit_slip_sales_id",
      "description",
      "date"
    ],
  selectColumns: [
      "cdssh_id",
      "cdssh_cash_deposit_slip_sales_id",
      "cdssh_description",
      "cdssh_date"
    ],
  selectOptionColumns: {
    id: "cdssh_id",
    cash_deposit_slip_sales_id: "cdssh_cash_deposit_slip_sales_id",
    description: "cdssh_description",
    date: "cdssh_date"
  },
  updateOptionColumns: {
    id: "id",
    cash_deposit_slip_sales_id: "cash_deposit_slip_sales_id",
    description: "description",
    date: "date"
  },
  selectDateFormatColumns: {
    date: "REPLACE(REPLACE(cdssh_date, 'T', ' '), 'Z', '') AS cdssh_date"
  },
  selectMiscColumns: {

  }
},
};

exports.Cash = Cash;