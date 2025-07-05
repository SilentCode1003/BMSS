const System = {
  system_logs: {
    tablename: 'system_logs',
    prefix: 'sl',
    prefix_: 'sl_',
    selectColums: [
      `sl_logid`,
      `sl_logdate`,
      `sl_loglevel`,
      `sl_source`,
      `sl_message`,
      `sl_userid`,
      `sl_ipaddress`,
    ],
    insertColumns: [`logdate`, `loglevel`, `source`, `message`, `userid`, `ipaddress`],
    selectOptionColumn: {
      logid: 'sl_logid',
      logdate: 'sl_logdate',
      loglevel: 'sl_loglevel',
      source: 'sl_source',
      message: 'sl_message',
      userid: 'sl_userid',
      ipaddress: 'sl_ipaddress',
    },
  },
}

exports.System = System
