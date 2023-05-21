const router = require("express").Router();

const adminController = require("../controllers/admin.controller");
const isAuth = require("../authguard");

// get requests
router.get("/modules", adminController.getModules);

router.get("/students", adminController.getStudents);

router.get(
  "/module-student/:moduleTitle", isAuth,
  adminController.getStudentsPerModule
);
router.get("/instructors", isAuth, adminController.getInstructors);
router.get("/total-attendants", isAuth, adminController.totalAttendance);
router.get('/reports', isAuth, adminController.generateStudentReports);

// post requests
router.post("/add-module", isAuth, adminController.addModule);
router.post("/new-user", isAuth, adminController.addUser);

// put requests
router.put("/edit-user/:id", isAuth, adminController.edituser);
router.put("/enroll-user/:userId", isAuth, adminController.enrollUser);
router.put(
  "/check-in/:studentId",
  isAuth,
  adminController.updateStudentCheckInStatus
);
router.put("/update-fee", isAuth, adminController.updateStudentFee);

// delete requests
router.delete("/user/:id", isAuth, adminController.deleteUser);
router.delete("/delete-module/:id", isAuth, adminController.deleteModule);

module.exports = router;
