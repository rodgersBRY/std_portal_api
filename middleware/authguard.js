const jwt = require("jsonwebtoken");

require("dotenv").config();

function throwError(errorText, statusCode) {
  const error = new Error(errorText);
  error.statusCode = statusCode;
  throw error;
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) next(throwError("Unauthorized", 401));

  const token = authHeader.split(" ")[0];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }

  if (!decodedToken) next(throwError("Unauthorized!", 401));

  req.userId = decodedToken.userId;
  next();
};
