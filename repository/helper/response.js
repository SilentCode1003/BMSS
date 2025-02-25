const MESSAGE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  EXIST: 'exist',
}

exports.JsonResponseSuccess = () => {
  return {
    message: MESSAGE_STATUS.SUCCESS,
  }
}

exports.JsonResponseData = (data) => {
  return {
    message: MESSAGE_STATUS.SUCCESS,
    data: data,
  }
}

exports.JsonResponseExist = () => {
  return {
    message: MESSAGE_STATUS.EXIST,
  }
}

exports.JsonResponseError = (error) => {
  return {
    message: error,
  }
}
