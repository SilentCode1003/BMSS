const Po = {
  pos_shift_logs: {
  tablename: "pos_shift_logs",
  prefix: "psl",
  prefix_: "psl_",
  insertColumns: [
      "posid",
      "posid",
      "date",
      "shift",
      "status"
    ],
  selectColumns: [
      "psl_posid",
      "psl_posid",
      "psl_date",
      "psl_shift",
      "psl_status"
    ],
  selectOptionColumns: {
    posid: "psl_posid",
    date: "psl_date",
    shift: "psl_shift",
    status: "psl_status"
  },
  updateOptionColumns: {
    posid: "posid",
    date: "date",
    shift: "shift",
    status: "status"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
  pos_config: {
  tablename: "pos_config",
  prefix: "pc",
  prefix_: "pc_",
  insertColumns: [
      "pos_id",
      "pos_printer",
      "production_kitchen_printer_ip",
      "paper_size",
      "printer_name",
      "isblutooth",
      "isprinter",
      "iscashdrawer",
      "issync"
    ],
  selectColumns: [
      "pc_id",
      "pc_pos_id",
      "pc_pos_printer",
      "pc_production_kitchen_printer_ip",
      "pc_paper_size",
      "pc_printer_name",
      "pc_isblutooth",
      "pc_isprinter",
      "pc_iscashdrawer",
      "pc_issync"
    ],
  selectOptionColumns: {
    id: "pc_id",
    pos_id: "pc_pos_id",
    pos_printer: "pc_pos_printer",
    production_kitchen_printer_ip: "pc_production_kitchen_printer_ip",
    paper_size: "pc_paper_size",
    printer_name: "pc_printer_name",
    isblutooth: "pc_isblutooth",
    isprinter: "pc_isprinter",
    iscashdrawer: "pc_iscashdrawer",
    issync: "pc_issync"
  },
  updateOptionColumns: {
    id: "id",
    pos_id: "pos_id",
    pos_printer: "pos_printer",
    production_kitchen_printer_ip: "production_kitchen_printer_ip",
    paper_size: "paper_size",
    printer_name: "printer_name",
    isblutooth: "isblutooth",
    isprinter: "isprinter",
    iscashdrawer: "iscashdrawer",
    issync: "issync"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Po = Po;