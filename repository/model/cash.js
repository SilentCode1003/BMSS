const Cash = {
  cash_drop: {
    tablename: 'cash_drop',
    prefix: 'cd',
    prefix_: 'cd_',
    selectColums: [
      `cd_id`,
      `cd_branch_id`,
      `cd_shift_number`,
      `cd_shift_date`,
      `cd_pos_id`,
      `cd_user_id`,
      `cd_datetime`,
      `cd_amount`,
    ],
    insertColumns: [
      `branch_id`,
      `shift_number`,
      `shift_date`,
      `pos_id`,
      `user_id`,
      `datetime`,
      `amount`,
    ],
    selectOptionColumn: {
      id: 'cd_id',
      branch_id: 'cd_branch_id',
      shift_number: 'cd_shift_number',
      shift_date: 'cd_shift_date',
      pos_id: 'cd_pos_id',
      user_id: 'cd_user_id',
      datetime: 'cd_datetime',
      amount: 'cd_amount',
    },
  },

  cash_report: {
    tablename: 'cash_report',
    prefix: 'cr',
    prefix_: 'cr_',
    selectColums: [
      `cr_report_id`,
      `cr_date`,
      `cr_shift`,
      `cr_pos`,
      `cr_cashier`,
      `cr_type`,
      `cr_status`,
    ],
    insertColumns: [`date`, `shift`, `pos`, `cashier`, `type`, `status`],
    selectOptionColumn: {
      id: 'cr_report_id',
      date: 'cr_date',
      shift: 'cr_shift',
      pos: 'cr_pos',
      cashier: 'cr_cashier',
      type: 'cr_type',
      status: 'cr_status',
    },
  },
}

exports.Cash = Cash
