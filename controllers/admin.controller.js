const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const Module = require("../models/module");
const User = require("../models/user");

require("dotenv").config();

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await Admin.findOne({ email: email });

    if (user) {
      const error = new Error("User already exists. Log in");
      error.statusCode = 409;
      throw error;
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = new Admin({
      name: name,
      email: email,
      password: hashedPass,
    });

    await newUser.save();

    res.status(201).json({ msg: "successfully registered!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let loadedUser;

  try {
    const user = await Admin.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    loadedUser = user;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      userId: loadedUser._id.toString(),
      user: loadedUser,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

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

exports.addUser = async (req, res, next) => {
  const { code, name, email, role, modules, phone, age, gender } = req.body;

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      const error = new Error("Email already exists");
      error.statusCode = 409;
      throw error;
    }

    let amount = 0;
    let moduleList = [];

    let newUser;

    // separate between instructors and students
    if (role === "student") {
      for (var mdl of modules) {
        const module = await Module.findOne({ name: mdl });

        if (!module) {
          const error = new Error("Module does not exist");
          error.statusCode = 404;
          throw error;
        }
        moduleList.push({
          name: mdl,
        });

        amount += module.feeAmount;
      }

      newUser = new User({
        code: code,
        name: name,
        email: email,
        role: role,
        phone: phone,
        age: parseInt(age),
        gender: gender,
        modules: moduleList,
        fee_balance: amount,
      });
    } else {
      newUser = new User({
        code: code,
        name: name,
        email: email,
        role: role,
        phone: phone,
        age: parseInt(age),
        gender: gender,
      });
    }

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

    user.fee_balance -= parseInt(amount);

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
      shortCode: uniqueCode,
      feeAmount: fee,
      topics: topics,
    });

    const resp = await newModule.save();

    res.status(201).json({ data: resp });
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
    }
    next(err);
  }
};

exports.enrollStudent = async (req, res, next) => {
  const userId = req.params.studentId;
  const moduleId = req.params.moduleId;

  try {
    const user = await User.findById(userId);
    let module = await Module.findById(moduleId);

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

    const resp = await user.save();
    res.status(201).json({ data: resp });
  } catch (err) {
    next(err);
  }
};
