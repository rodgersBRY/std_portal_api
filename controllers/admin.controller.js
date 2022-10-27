const Module = require("../models/module");
const User = require("../models/user");

exports.getStudents = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student" });

    if (users.length > 0) {
      res.status(200).json({ data: users });
    } else {
      res.status(200).json({ msg: "no students registered" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Server error";
    }
    next(err);
  }
};

exports.getInstructors = async (req, res, next) => {
  try {
    const users = await User.find({ role: "instructor" });

    if (users.length > 0) {
      res.status(200).json({ data: users });
    } else {
      res.status(200).json({ msg: "no instructor registered" });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Server error";
    }
    next(err);
  }
};

exports.addStudent = async (req, res, next) => {
  const { name, email, role, modules, fee_balance, status } = req.body;

  const userExists = await User.findOne({ email: email });

  if (!userExists) {
    const newStudent = new User({
      name: name,
      email: email,
      role: role,
      modules: modules,
      fee_balance: fee_balance,
      status: status,
    });

    try {
      await newStudent.save();
      res.status(201).json({ msg: "student added to te system" });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  } else {
    res.status(201).json({ msg: "student with that email exists" });
  }
};

exports.addModule = async (req, res, next) => {
  const { name, code, fee, topics } = req.body;

  const moduleExist = await Module.findOne({ name: name.toLowerCase() });
  if (!moduleExist) {
    let newModule = new Module({
      name: name.toLowerCase(),
      shortCode: code,
      feeAmount: fee,
      topics: topics,
    });

    try {
      await newModule.save();

      res.status(201).json({ msg: "successfully saved" });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Server error";
      }
      next(err);
    }
  } else {
    res
      .status(409)
      .json({ error: "module already exists", module: moduleExist });
  }
};

exports.deleteModule = async (req, res, next) => {
  const id = req.params.id;

  try {
    const module = await Module.findById(id);
    if (!module) {
      const error = new Error("No module with that id");
      error.statusCode = 404;
      throw error;
    }
    await Module.remove();
    res.status(201).json({ msg: "deleted record " + id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Server error";
    }
    next(err);
  }
};
