function isEmpty(variable) {
  // Check for null or undefined
  if (variable === null || variable === undefined) {
    return true
  }

  // Check for empty string
  if (typeof variable === 'string' && variable.trim().length === 0) {
    return true
  }

  // Check for empty array
  if (Array.isArray(variable) && variable.length === 0) {
    return true
  }

  // Check for empty object
  if (
    typeof variable === 'object' &&
    !Array.isArray(variable) &&
    Object.keys(variable).length === 0
  ) {
    return true
  }

  // If it's not one of the above, it's not empty
  return false
}


module.exports = { isEmpty }