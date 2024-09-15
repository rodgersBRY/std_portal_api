function throwError(errorText, statusCode) {
  const error = new Error(errorText);
  error.statusCode = statusCode;
  throw error;
}

function generateRandomNo() {
  var low = Math.ceil(1);
  var high = Math.floor(1000);
  var randomFloat = low + Math.random() * (high - low);
  return Math.ceil(randomFloat);
}

module.exports = { throwError, generateRandomNo };
