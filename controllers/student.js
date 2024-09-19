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

    modules.forEach((mdl) => {
      amount += parseInt(mdl.amount, 10);

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
      modules: modules,
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

  const { modules } = req.body;

  try {
    if (modules.length <= 0) throwError("Cannot submit zero modules", 401);

    const student = await getStudentById(id);

    let updatedActivities = [...student.activity];
    let studentModules = [...student.modules];
    let fee = student.fee_balance;
    let payable = student.amount_payable;

    modules.forEach((mdl) => {
      // add enrolled module to list
      studentModules.push(mdl);

      // update the fee
      fee += mdl.amount;
      payable += mdl.amount;

      //update the activity log
      updatedActivities.push({
        title: "Course Enrollment",
        value: mdl.name + " - " + mdl.amount,
        amount: fee,
        ts: Date.now(),
      });
    });

    console.log({
      modules: studentModules,
      activity: updatedActivities,
      amount_payable: payable,
      fee_balance: fee,
    });

    const updatedStudent = editStudentById(id, {
      modules: studentModules,
      activity: updatedActivities,
      amount_payable: payable,
      fee_balance: fee,
    });

    res.status(201).json({ updatedStudent });
  } catch (err) {
    next(err);
  }
};

exports.updateFeePayment = async (req, res, next) => {
  try {
    const id = req.params.id;

    const fee = req.body.fee;

    const student = await getStudentById(id);

    let amount_paid = student.amount_paid;

    if (!student) throwError("Student cannot be found", 404);

    if (student.fee_balance - fee < 0)
      throwError("amount is more than fee balance", 401);

    amount_paid += fee;

    let activity = [...student.activity];

    activity.push({
      title: "Fee Payment",
      value: "",
      amount: fee,
      ts: Date.now(),
    });

    const updatedData = await editStudentById(id, {
      fee_balance: student.fee_balance - fee,
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
