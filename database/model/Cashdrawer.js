const Cashdrawer = {
  cashdrawer_cash_float: {
  tablename: "cashdrawer_cash_float",
  prefix: "ccf",
  prefix_: "ccf_",
  insertColumns: [
      "date",
      "branch_id",
      "pos",
      "shift",
      "cashier",
      "cash_float",
      "denomination"
    ],
  selectColumns: [
      "ccf_id",
      "ccf_date",
      "ccf_branch_id",
      "ccf_pos",
      "ccf_shift",
      "ccf_cashier",
      "ccf_cash_float",
      "ccf_denomination"
    ],
  selectOptionColumns: {
    id: "ccf_id",
    date: "ccf_date",
    branch_id: "ccf_branch_id",
    pos: "ccf_pos",
    shift: "ccf_shift",
    cashier: "ccf_cashier",
    cash_float: "ccf_cash_float",
    denomination: "ccf_denomination"
  },
  updateOptionColumns: {
    id: "id",
    date: "date",
    branch_id: "branch_id",
    pos: "pos",
    shift: "shift",
    cashier: "cashier",
    cash_float: "cash_float",
    denomination: "denomination"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  cashdrawer_report: {
  tablename: "cashdrawer_report",
  prefix: "cr",
  prefix_: "cr_",
  insertColumns: [
      "branch_id",
      "shift",
      "date",
      "pos_id",
      "user_id",
      "total",
      "denomination"
    ],
  selectColumns: [
      "cr_id",
      "cr_branch_id",
      "cr_shift",
      "cr_date",
      "cr_pos_id",
      "cr_user_id",
      "cr_total",
      "cr_denomination"
    ],
  selectOptionColumns: {
    id: "cr_id",
    branch_id: "cr_branch_id",
    shift: "cr_shift",
    date: "cr_date",
    pos_id: "cr_pos_id",
    user_id: "cr_user_id",
    total: "cr_total",
    denomination: "cr_denomination"
  },
  updateOptionColumns: {
    id: "id",
    branch_id: "branch_id",
    shift: "shift",
    date: "date",
    pos_id: "pos_id",
    user_id: "user_id",
    total: "total",
    denomination: "denomination"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  cashdrawer_activity: {
  tablename: "cashdrawer_activity",
  prefix: "ca",
  prefix_: "ca_",
  insertColumns: [
      "branch_id",
      "shift_number",
      "pos_id",
      "shift_date",
      "user_id",
      "datetime",
      "description",
      "status"
    ],
  selectColumns: [
      "ca_id",
      "ca_branch_id",
      "ca_shift_number",
      "ca_pos_id",
      "ca_shift_date",
      "ca_user_id",
      "ca_datetime",
      "ca_description",
      "ca_status"
    ],
  selectOptionColumns: {
    id: "ca_id",
    branch_id: "ca_branch_id",
    shift_number: "ca_shift_number",
    pos_id: "ca_pos_id",
    shift_date: "ca_shift_date",
    user_id: "ca_user_id",
    datetime: "ca_datetime",
    description: "ca_description",
    status: "ca_status"
  },
  updateOptionColumns: {
    id: "id",
    branch_id: "branch_id",
    shift_number: "shift_number",
    pos_id: "pos_id",
    shift_date: "shift_date",
    user_id: "user_id",
    datetime: "datetime",
    description: "description",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Cashdrawer = Cashdrawer;