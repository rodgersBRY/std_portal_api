const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = new Error("Unauthorized!");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    if (!decodedToken) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    next(err);
  }
};
