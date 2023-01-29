const bcrypt = require("bcrypt");

const Admin = require("../models/admin");
const Module = require("../models/module");
const User = require("../models/user");

require("dotenv").config();

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

const generateRandomNo = () => {
  var low = Math.ceil(1);
  var high = Math.floor(1000);
  var randomFloat = low + Math.random() * (high - low);
  return Math.ceil(randomFloat);
};

exports.addUser = async (req, res, next) => {
  const { name, email, role, modules, phone, age, gender } = req.body;

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    let amount = 0;
    let moduleList = [];

    let newUser;

    // separate between instructors and students
    for (var mdl of modules) {
      const module = await Module.findOne({ name: mdl });

      if (!module) {
        const error = new Error("Module does not exist");
        error.statusCode = 404;
        throw error;
      }

      moduleList.push({
        name: mdl,
        amount: module.feeAmount,
      });

      amount += module.feeAmount;
    }

    // student has a fee balance field
    newUser = new User({
      code: "JW-" + generateRandomNo(),
      name: name,
      email: email,
      role: role,
      phone: phone,
      age: parseInt(age),
      gender: gender,
      modules: moduleList,
      fee_balance: amount,
    });

    await newUser.save();
    res.status(201).json({ msg: "user created" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User does not exist in the database!");
      error.statusCode = 404;
      throw error;
    }

    await user.remove();

    res.status(200).json({ msg: `student ${userId} deleted from system` });
  } catch (err) {
    next(err);
  }
};

exports.updateStudentFee = async (req, res, next) => {
  const { amount, id } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      const error = new Error("User does not exist in the database!");
      error.statusCode = 404;
      throw error;
    }

    if (user.fee_balance <= 0) {
      user.fee_balance = 0;
    } else {
      user.fee_balance -= parseInt(amount);
    }

    const resp = await user.save();
    res.status(201).json({ resp });
  } catch (err) {
    next(err);
  }
};

exports.addModule = async (req, res, next) => {
  const { title, uniqueCode, fee, topics } = req.body;

  try {
    const moduleExist = await Module.findOne({ name: title.toLowerCase() });

    if (moduleExist) {
      const error = new Error("module already exists");
      error.statusCode = 409;
      throw error;
    }

    let newModule = new Module({
      name: title.toLowerCase(),
      shortCode: "JC-" + generateRandomNo(),
      feeAmount: fee,
      topics: topics,
    });

    const resp = await newModule.save();

    res.status(201).json({ resp });
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

    await module.remove();
    res.status(201).json({ msg: "deleted record " + id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.enrollStudent = async (req, res, next) => {
  const userId = req.params.studentId;

  const moduleName = req.body.moduleName;

  console.log(userId, req.body);

  try {
    const user = await User.findById(userId);
    const module = await Module.findOne({ name: moduleName });

    const moduleExists = user.modules.some((mdl) => mdl.name === module.name);

    if (moduleExists) {
      const error = new Error("Student already enrolled to module");
      error.statusCode = 409;
      throw error;
    }

    const updatedModuleList = [...user.modules];

    updatedModuleList.push({ name: module.name });

    user.modules = updatedModuleList;
    user.fee_balance += module.feeAmount;

    const updatedUser = await user.save();
    res.status(201).json({ updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.getStudentsPerModule = async (req, res, next) => {
  const moduleTitle = req.params.moduleTitle;

  let studentList = [];

  try {
    const users = await User.find({ role: "student" });

    // filter students to a course
    for (var user of users) {
      for (var mdl of user.modules) {
        if (mdl.name === moduleTitle) {
          studentList.push(user);
        }
      }
    }

    res.status(200).json({ studentList });
  } catch (err) {
    next(err);
  }
};
