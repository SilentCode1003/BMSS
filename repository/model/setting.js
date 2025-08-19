const Setting = {
  routes: {
    tablename: 'routes',
    prefix: 'r',
    prefix_: 'r_',
    selectColums: [
      `r_id`,
      `r_name`,
      `r_route`,
      `r_layout`,
      `r_status`,
      `r_create_at`,
      `r_create_by`,
    ],
    insertColumns: [`name`, `route`, `layout`, `status`, `create_at`, `create_by`],
    selectOptionColumn: {
      id: 'r_id',
      name: 'r_name',
      route: 'r_route',
      layout: 'r_layout',
      status: 'r_status',
      create_at: 'r_create_at',
      create_by: 'r_create_by',
    },
  },
  access_route: {
    tablename: 'access_route',
    prefix: 'ar',
    prefix_: 'ar_',
    selectColums: [
      `ar_id`,
      `ar_access_id`,
      `ar_route_id`,
      `ar_access_type`,
      `ar_status`,
      `ar_create_at`,
      `ar_create_by`,
    ],
    insertColumns: [`access_id`, `route_id`, `access_type`, `status`, `create_at`, `create_by`],
    selectOptionColumn: {
      id: 'ar_id',
      access_id: 'ar_access_id',
      route_id: 'ar_route_id',
      access_type: 'ar_access_type',
      status: 'ar_status',
      create_at: 'ar_create_at',
      create_by: 'ar_create_by',
    },
  },
}

exports.Setting = Setting
