const Refund = {
  refund: {
    tablename: 'refund',
    prefix: 'r',
    prefix_: 'r_',
    selectColums: [`r_id`, `r_detailid`, `r_reason`, `r_cashier`, `r_date`],
    insertColumns: [`detailid`, `reason`, `cashier`, `date`],
    selectOptionColumn: {
      id: 'r_id',
      detailid: 'r_detailid',
      reason: 'r_reason',
      cashier: 'r_cashier',
      date: 'r_date',
    },
  },
}

exports.Refund = Refund
