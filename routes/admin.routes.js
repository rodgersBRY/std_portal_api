const router = require("express").Router();

const adminController = require("../controllers/admin.controller");

router.post("/register", adminController.registerUser);

router.post("/login", adminController.login);

router.post("/add-module", adminController.addModule);

router.post("/new-user", adminController.addUser);

router.post('/enroll-student/:studentId/:moduleId', adminController.enrollStudent);

router.get("/students", adminController.getStudents);

router.get("/instructors", adminController.getInstructors);

router.delete("/student/:id", adminController.deleteStudent);

router.delete("/delete-module/:id", adminController.deleteModule);

module.exports = router;
