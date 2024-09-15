const app = require("express").Router();
const controller = require("../controllers/student");

app.route("/").get(controller.getStudents).post(controller.newStudent);

app
  .route("/:id")
  .get(controller.getStudent)
  .put(controller.editStudent)
  .delete(controller.deleteStudent);

app.route("/enroll/:id").put(controller.addModule);
app.route("/update-fee/:id").put(controller.updateFeePayment);

module.exports = app;
