const Request = {
  request_notification: {
  tablename: "request_notification",
  prefix: "rn",
  prefix_: "rn_",
  insertColumns: [
      "type",
      "userid",
      "branchid",
      "message",
      "status",
      "date"
    ],
  selectColumns: [
      "rn_id",
      "rn_type",
      "rn_userid",
      "rn_branchid",
      "rn_message",
      "rn_status",
      "rn_date"
    ],
  selectOptionColumns: {
    id: "rn_id",
    type: "rn_type",
    userid: "rn_userid",
    branchid: "rn_branchid",
    message: "rn_message",
    status: "rn_status",
    date: "rn_date"
  },
  updateOptionColumns: {
    id: "id",
    type: "type",
    userid: "userid",
    branchid: "branchid",
    message: "message",
    status: "status",
    date: "date"
  },
  selectDateFormatColumns: {

  },
  selectMiscColumns: {

  }
},
};

exports.Request = Request;