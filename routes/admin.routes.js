const router = require("express").Router();

const adminController = require("../controllers/admin.controller");
const isAuth = require("../authguard");

router.post("/register", adminController.registerUser);

router.post("/login", adminController.login);

router.post("/add-module", isAuth, adminController.addModule);

router.post("/new-user", adminController.addUser);

router.post(
  "/enroll-student/:studentId/:moduleId",
  adminController.enrollStudent
);

router.post("/logout", adminController.logout);

router.put("/update-fee", adminController.updateStudentFee);

router.get("/students", adminController.getStudents);

router.get("/instructors", adminController.getInstructors);

router.delete("/user/:id", isAuth, adminController.deleteUser);

router.delete("/delete-module/:id", adminController.deleteModule);

module.exports = router;
