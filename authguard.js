require("dotenv").config();

module.exports = (req, res, next) => {
  if (!req.session.user) {
    const error = new Error("Unauthorized Operation");
    error.statusCode = 401;
    throw error;
  }

  return next();
};
