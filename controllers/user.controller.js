const Module = require("../models/module");

exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find();
    if (modules.length > 0) {
      res.status(200).json({ data: modules });
    } else {
      res.status(200).json({ msg: "no modules created" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Server error";
    }
    next(err);
  }
};
