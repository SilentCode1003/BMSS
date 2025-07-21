const Epayment = {
  epayment_details: {
    tablename: 'epayment_details',
    prefix: 'ed',
    prefix_: 'ed_',
    selectColums: [`ed_paymentid`, `ed_detailid`, `ed_type`, `ed_referenceid`, `ed_date`],
    insertColumns: [`paymentid`, `detailid`, `type`, `referenceid`, `date`],
    selectOptionColumn: {
      paymentid: 'ed_paymentid',
      detailid: 'ed_detailid',
      type: 'ed_type',
      referenceid: 'ed_referenceid',
      date: 'ed_date',
    },
  },
}

exports.Epayment = Epayment
