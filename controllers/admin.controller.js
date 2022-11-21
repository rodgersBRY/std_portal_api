const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const Module = require("../models/module");
const User = require("../models/user");

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // check if user exists
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
      console.log("user not found");
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
  const {
    code,
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

    const newUser = new User({
      code: code,
      name: name,
      email: email,
      role: role.toLowerCase(),
      modules: modules,
      phone: phone,
      age: age,
      gender: gender,
      fee_balance: fee_balance ?? 0,
      status: status,
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

exports.deleteStudent = async (req, res, next) => {
  const studentId = req.params.id;

  try {
    const student = await User.findById(studentId);

    if (!student) {
      const error = new Error("Student does not exist in the database!");
      error.statusCode = 404;
      throw error;
    }

    await student.remove();

    res.status(200).json({ msg: `student ${studentId} deleted from system` });
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

    const moduleExists = user.modules.some(
      (mdl) => mdl.name === module.name
    );

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
