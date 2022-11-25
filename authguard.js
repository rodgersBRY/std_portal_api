const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error("Unauthorized User");
    error.statusCode = 401;
    throw error;
  }

  // const authHeader = req.headers["authorization"];

  // if (!authHeader) {
  //   const error = new Error("Unauthorized User");
  //   error.statusCode = 401;
  //   throw error;
  // }

  // const token = authHeader.split(" ")[1];

  // let decodedToken;

  // try {
  //   decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
  // } catch (err) {
  //   next(err);
  // }

  // console.log(decodedToken);

  // if (!decodedToken) {
  //   const error = new Error("Unverified Token!");
  //   error.statusCode = 401;
  //   throw error;
  // }

  // req.userId = decodedToken.userId;
  next();
};
