const router = require("express").Router();

const adminController = require("../controllers/admin.controller");
const authGuardMiddleware = require("../authguard");

router.post("/register", adminController.registerUser);

router.post("/login", adminController.login);

router.post("/add-module", authGuardMiddleware, adminController.addModule);

router.post("/new-user", authGuardMiddleware, adminController.addUser);

router.post(
  "/enroll-student/:studentId/:moduleId",
  authGuardMiddleware,
  adminController.enrollStudent
);

router.put(
  "/update-fee",
  authGuardMiddleware,
  adminController.updateStudentFee
);

router.get("/students", authGuardMiddleware, adminController.getStudents);

router.get("/instructors", authGuardMiddleware, adminController.getInstructors);

router.delete("/user/:id", authGuardMiddleware, adminController.deleteUser);

router.delete(
  "/delete-module/:id",
  authGuardMiddleware,
  adminController.deleteModule
);

module.exports = router;
