const router = require("express").Router();

const adminController = require("../controllers/admin.controller");
const isAuth = require("../authguard");

// get requests
router.get("/modules", adminController.getModules);

router.get("/students", adminController.getStudents);

router.get(
  "/module-student/:moduleTitle",
  adminController.getStudentsPerModule
);

router.get("/instructors", adminController.getInstructors);

// post requests
router.post("/add-module", isAuth, adminController.addModule);

router.post("/new-user", isAuth, adminController.addUser);

router.put(
  "/enroll-user/:userId",
  isAuth,
  adminController.enrollUser
);

// put requests
router.put("/update-fee", isAuth, adminController.updateStudentFee);

// delete requests
router.delete("/user/:id", isAuth, adminController.deleteUser);

router.delete("/delete-module/:id", isAuth, adminController.deleteModule);

module.exports = router;
