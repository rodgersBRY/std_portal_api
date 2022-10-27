const router = require("express").Router();

const adminController = require("../controllers/admin.controller");

router.post("/add-module", adminController.addModule);

router.post("/new-student", adminController.addStudent);

router.get("/students", adminController.getStudents);

router.get("/instructors", adminController.getInstructors);

router.delete("/delete-module/:id", adminController.deleteModule);

module.exports = router;
