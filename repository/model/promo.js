const Promo = {
  promo_details: {
    tablename: 'promo_details',
    prefix: 'pd',
    prefix_: 'pd_',
    selectColums: [
      `pd_promoid`,
      `pd_name`,
      `pd_description`,
      `pd_dtipermit`,
      `pd_condition`,
      `pd_startdate`,
      `pd_enddate`,
      `pd_status`,
      `pd_createdby`,
      `pd_createddate`,
    ],
    insertColumns: [
      `name`,
      `description`,
      `dtipermit`,
      `condition`,
      `startdate`,
      `enddate`,
      `status`,
      `createdby`,
      `createddate`,
    ],
    selectOptionColumn: {
      promoid: 'pd_promoid',
      name: 'pd_name',
      description: 'pd_description',
      dtipermit: 'pd_dtipermit',
      condition: 'pd_condition',
      startdate: 'pd_startdate',
      enddate: 'pd_enddate',
      status: 'pd_status',
      createdby: 'pd_createdby',
      createddate: 'pd_createddate',
    },
  },
}

exports.Promo = Promo
