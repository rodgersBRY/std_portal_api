const {
  getStudents,
  getStudentByEmailPhone,
  editStudentById,
  addStudent,
  getStudentById,
  deleteStudentById,
} = require("../models/student");
const { throwError, generateRandomNo } = require("../helpers");

exports.getStudents = async (req, res, next) => {
  try {
    const students = await getStudents(req.userId);

    if (!students) throwError("Error fecthing students", 400);

    res.status(200).json({ students });
  } catch (err) {
    next(err);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const id = req.params.id;

    const student = await getStudentById(id);

    if (!student) throwError("Cannot fetch Student", 400);

    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

exports.newStudent = async (req, res, next) => {
  const { name, email, idNo, modules, phone, age, gender, enrollDate } =
    req.body;

  try {
    const studentExists = await getStudentByEmailPhone(email, phone);

    if (studentExists) throwError("Student already exists", 409);

    let amount = 0;
    let studentActivity = [];

    // convert module names to lowercase
    const formattedModules = modules.map((mdl) => ({
      name: mdl.name.toLowerCase(),
      amount: parseInt(mdl.amount),
    }));

    formattedModules.forEach((mdl) => {
      amount += mdl.amount;

      studentActivity.push({
        title: "Course Enrollment",
        value: mdl.name,
        amount: mdl.amount,
        ts: Date.now(),
      });
    });

    let studentData = {
      user: req.userId,
      code: "JW-" + generateRandomNo(),
      name: name,
      email: email,
      phone: phone,
      age: age,
      gender: gender,
      modules: formattedModules,
      activity: studentActivity,
      fee_balance: amount,
      idNo: idNo,
      amount_payable: amount,
      enrollDate: enrollDate,
    };

    const student = await addStudent(studentData);

    res.status(201).json({ msg: "student created", student });
  } catch (err) {
    next(err);
  }
};

exports.editStudent = async (req, res, next) => {
  const id = req.params.id;

  const { name, email, phone, idNo } = req.body;

  try {
    const student = await getStudentById(id);

    if (!student) throwError("Error finding details", 400);

    const updatedStudent = await editStudentById(id, {
      name,
      email,
      phone,
      idNo,
    });

    res
      .status(201)
      .json({ updatedStudent, message: "Student details updated!" });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  const id = req.params.id;

  try {
    const student = await deleteStudentById(id);

    if (!student) throwError("Student does not exist!", 404);

    res.status(200).json({ msg: `student ${id} has been deleted` });
  } catch (err) {
    next(err);
  }
};

exports.addModule = async (req, res, next) => {
  const id = req.params.id;

  const { module } = req.body;

  try {
    const student = await getStudentById(id);

    let updatedActivities = [...student.activity];
    let studentModules = [...student.modules];
    let fee = student.fee_balance;
    let payable = student.amount_payable;

    // avoid duplicate modules for each student
    studentModules.forEach((mdl) => {
      if (mdl.name.toLowerCase() == module.name.toLowerCase())
        throwError("Student already enrolled to course", 409);
    });

    // add enrolled module to list
    studentModules.push({
      name: module.name,
      amount: parseInt(module.amount),
    });

    // update the fee
    fee += parseInt(module.amount);
    payable += parseInt(module.amount);

    //update the activity log
    updatedActivities.push({
      title: "Course Enrollment",
      value: module.name,
      amount: parseInt(module.amount),
      ts: Date.now(),
    });

    const data = {
      modules: studentModules,
      activity: updatedActivities,
      amount_payable: payable,
      fee_balance: fee,
    };

    const updatedStudent = await editStudentById(id, data);

    res.status(201).json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

exports.updateFeePayment = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { amount, desc } = req.body;

    let intAmount = parseInt(amount);

    if (intAmount <= 0) throwError("Invalid amount", 401);

    const student = await getStudentById(id);
    if (!student) throwError("Student cannot be found", 404);

    let amount_paid = student.amount_paid;

    if (student.fee_balance - intAmount < 0)
      throwError("The amount entered is higher than balance", 401);

    amount_paid += intAmount;

    let activity = [...student.activity];
    activity.push({
      title: "Fee Payment",
      value: desc,
      amount: intAmount,
      ts: Date.now(),
    });

    const updatedData = await editStudentById(id, {
      fee_balance: student.fee_balance - intAmount,
      activity,
      amount_paid,
    });

    res.status(201).json(updatedData);
  } catch (err) {
    next(err);
  }
};

exports.printReceipt = async (req, res, next) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, "receipt.html"), "utf-8");

    let options = { format: "A5" };
    let file = { content: html };

    htmlToPDF
      .generatePdf(file, options)
      .then((pdfBuffer) => {
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename='receipt.pdf'",
          "Content-Length": pdfBuffer.length,
        });
      })
      .catch((err) => {
        console.error(err);
      });
    res.json({ message: "printed" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
