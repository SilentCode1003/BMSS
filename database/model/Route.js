const Route = {
  routes: {
  tablename: "routes",
  prefix: "r",
  prefix_: "r_",
  insertColumns: [
      "name",
      "route",
      "layout",
      "status",
      "create_at",
      "create_by"
    ],
  selectColumns: [
      "r_id",
      "r_name",
      "r_route",
      "r_layout",
      "r_status",
      "r_create_at",
      "r_create_by"
    ],
  selectOptionColumns: {
    id: "r_id",
    name: "r_name",
    route: "r_route",
    layout: "r_layout",
    status: "r_status",
    create_at: "r_create_at",
    create_by: "r_create_by"
  },
  updateOptionColumns: {
    id: "id",
    name: "name",
    route: "route",
    layout: "layout",
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

exports.Route = Route;