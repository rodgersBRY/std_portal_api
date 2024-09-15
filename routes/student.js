const app = require("express").Router(),
  controller = require("../controllers/student"),
  authGuard = require("../middleware/authguard");

app
  .route("/")
  .get(authGuard, controller.getStudents)
  .post(authGuard, controller.newStudent);

app
  .route("/:id")
  .get(authGuard, controller.getStudent)
  .put(authGuard, controller.editStudent)
  .delete(authGuard, controller.deleteStudent);

app.route("/enroll/:id").put(authGuard, controller.addModule);
app.route("/update-fee/:id").put(authGuard, controller.updateFeePayment);

module.exports = app;
