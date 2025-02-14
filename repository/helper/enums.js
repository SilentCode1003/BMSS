const Status = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Deleted: 'DELETED',
  Adjustment: 'ADJUSTMENT',
  Production: 'PRODUCTION',
  Replenishment: 'REPLENISHMENT',
  Approved: 'APPROVED',
  Pending: 'PENDING',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
}

exports.ProductionStatus = Status

const ResponseCode = {
  Success: 200,
  NotFound: 404,
  NotExist: 400,
  Exist: 409,
  Error: 500,
}


exports.ResponseCode = ResponseCode