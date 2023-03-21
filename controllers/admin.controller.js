const Module = require("../models/module");
const User = require("../models/user");

require("dotenv").config();

function throwError(errorText, statusCode) {
  const error = new Error(errorText);
  error.statusCode = statusCode;
  throw error;
}

function generateRandomNo() {
  var low = Math.ceil(1);
  var high = Math.floor(1000);
  var randomFloat = low + Math.random() * (high - low);
  return Math.ceil(randomFloat);
}

exports.getStudents = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student" });

    if (users.length <= 0) throwError("No students registered", 404);

    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.getInstructors = async (req, res, next) => {
  try {
    const users = await User.find({ role: "instructor" });

    if (users.length <= 0) throwError("No instructor registered!", 404);

    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find();
    if (modules.length === 0) throwError("no modules created", 404);

    res.status(200).json({ data: modules });
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  const { name, email, role, modules, phone, age, gender, enrollDate } =
    req.body;

  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) throwError("User already exists", 409);

    let amount = 0;
    let userActivity = [];
    let moduleList = [];

    let newUser;

    // separate between instructors and students
    for (var mdl of modules) {
      const module = await Module.findOne({ name: mdl });

      if (!module) throwError("Module not found", 404);

      moduleList.push({
        name: mdl,
        amount: module.feeAmount,
      });

      if (role === "student") {
        amount += module.feeAmount;
      }

      userActivity.push({
        title: "Course Enrollment",
        value: mdl,
        prev_balance: amount,
        ts: Date.now(),
      });
    }

    newUser = new User({
      code: "JW-" + generateRandomNo(),
      name: name,
      email: email,
      role: role,
      phone: phone,
      age: parseInt(age),
      gender: gender,
      modules: moduleList,
      activity: userActivity,
      fee_balance: amount,
      amount_payable: amount,
      createdAt: enrollDate || new Date.now(),
    });

    await newUser.save();
    res.status(201).json({ msg: "user created" });
  } catch (err) {
    next(err);
  }
};

exports.edituser = async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, phone, age, createdAt } = req.body;

  console.log(createdAt);

  try {
    const user = await User.findById(userId);

    if (!user) throwError("User not found", 404);

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.age = age;
    user.createdAt = createdAt;

    const result = await user.save();

    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) throwError("User does not exist!", 404);

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

    if (!user) throwError("User does not exist", 404);

    let prev_balance = user.fee_balance;

    if (amount > user.fee_balance)
      throwError("Amount must be less than or equal to the fee balance", 409);

    if (user.fee_balance <= 0) {
      user.fee_balance = 0;
    } else {
      user.fee_balance -= parseInt(amount);
      user.amount_paid += parseInt(amount);
    }

    // keep a log of the user fee payment activity
    const updatedActivityList = [...user.activity];
    updatedActivityList.push({
      title: "Fee Payment",
      value: amount,
      prev_balance: prev_balance,
      ts: Date.now(),
    });

    user.activity = updatedActivityList;

    const resp = await user.save();
    res.status(201).json({ resp });
  } catch (err) {
    next(err);
  }
};

exports.addModule = async (req, res, next) => {
  const { title, fee, topics } = req.body;

  try {
    const moduleExist = await Module.findOne({ name: title.toLowerCase() });

    if (moduleExist) throwError("Module already exists", 409);

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
    if (!module) throwError("Module not found", 404);

    await module.remove();
    res.status(201).json({ msg: "deleted record " + id });
  } catch (err) {
    next(err);
  }
};

exports.enrollUser = async (req, res, next) => {
  const userId = req.params.userId;

  const moduleName = req.body.moduleName;

  try {
    const user = await User.findById(userId);
    const module = await Module.findOne({ name: moduleName });

    const moduleExists = user.modules.some((mdl) => mdl.name === module.name);

    if (moduleExists) throwError("User already enrolled to course", 409);

    const updatedModuleList = [...user.modules];
    const updatedActivityList = [...user.activity];

    updatedModuleList.push({ name: module.name, amount: module.feeAmount });
    updatedActivityList.push({
      title: "Course Enrollment",
      value: module.name + " - " + module.feeAmount,
      prev_balance: user.fee_balance,
      ts: Date.now(),
    });

    user.modules = updatedModuleList;
    user.activity = updatedActivityList;

    // update fee balance for students
    if (user.role === "student") {
      user.fee_balance += module.feeAmount;
      user.amount_payable += module.feeAmount;
    }

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

exports.updateStudentCheckInStatus = async (req, res, next) => {
  const studentId = req.params.studentId;
  const status = req.body.status;

  try {
    const student = await User.findById(studentId);
    if (!student) throwError("No student found", 404);

    student.checkedIn = status;

    const updatedStudent = await student.save();

    res.status(201).json({ updatedStudent });
  } catch (err) {
    next(err);
  }
};

exports.totalAttendance = async (req, res, next) => {
  try {
    const students = await User.find({ checkedIn: true, role: "student" });

    let totalAttendance = students.length;

    res.status(200).json({ totalAttendance });
  } catch (err) {
    next(err);
  }
};

exports.generateStudentReports = async (req, res, next) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const startOfPrevMonth = new Date(year, month - 1, 1);
  const endOfPrevMonth = new Date(year, month, 0);

  try {
    const students = await User.find({
      role: "student",
      createdAt: {
        $gte: startOfPrevMonth,
        $lte: endOfPrevMonth,
      },
    });

    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};
