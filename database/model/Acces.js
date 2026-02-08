const Acces = {
  access_route: {
  tablename: "access_route",
  prefix: "ar",
  prefix_: "ar_",
  insertColumns: [
      "access_id",
      "route_id",
      "access_type",
      "status",
      "create_at",
      "create_by"
    ],
  selectColumns: [
      "ar_id",
      "ar_access_id",
      "ar_route_id",
      "ar_access_type",
      "ar_status",
      "ar_create_at",
      "ar_create_by"
    ],
  selectOptionColumns: {
    id: "ar_id",
    access_id: "ar_access_id",
    route_id: "ar_route_id",
    access_type: "ar_access_type",
    status: "ar_status",
    create_at: "ar_create_at",
    create_by: "ar_create_by"
  },
  updateOptionColumns: {
    id: "id",
    access_id: "access_id",
    route_id: "route_id",
    access_type: "access_type",
    status: "status",
    create_at: "create_at",
    create_by: "create_by"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Acces = Acces;