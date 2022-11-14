const Module = require("../models/module");
const User = require("../models/user");

exports.getStudents = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student" });

    if (users.length <= 0) {
      const error = new Error("No Students Registered");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ data: users });
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

    if (users.length <= 0) {
      const error = new Error("No Instructor Registered");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ data: users });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Server error";
    }
    next(err);
  }
};

exports.addStudent = async (req, res, next) => {
  const {
    name,
    email,
    role,
    modules,
    phone,
    age,
    gender,
    fee_balance,
    status,
  } = req.body;

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    const newStudent = new User({
      name: name,
      email: email,
      role: role,
      modules: modules,
      phone: phone,
      age: age,
      gender: gender,
      fee_balance: fee_balance,
      status: status,
    });

    await newStudent.save();
    res.status(201).json({ msg: "student created" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addModule = async (req, res, next) => {
  const { name, code, fee, topics } = req.body;
  try {
    const moduleExist = await Module.findOne({ name: name.toLowerCase() });
    if (moduleExist) {
      const error = new Error("module already exists");
      error.statusCode = 409;
      throw error;
    }

    let newModule = new Module({
      name: name.toLowerCase(),
      shortCode: code,
      feeAmount: fee,
      topics: topics,
    });

    await newModule.save();

    res.status(201).json({ msg: "successfully saved" });
  } catch (err) {
    next(err);
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
