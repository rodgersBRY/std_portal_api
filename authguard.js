module.exports = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    const error = new Error("Unauthorized Operation!");
    error.statusCode = 401;
    throw error;
  }
};
