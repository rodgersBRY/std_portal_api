const { model, Schema } = require("mongoose");

const activitySchema = new Schema(
  {
    title: String,
    value: String,
    amount: Number,
    ts: Date,
  },
  { _id: false }
);

const moduleSchema = new Schema(
  { name: String, amount: Number },
  { _id: false }
);

const studentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    idNo: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    fee_balance: {
      type: Number,
      required: false,
    },
    amount_paid: {
      type: Number,
      default: 0,
      required: false,
    },
    amount_payable: {
      type: Number,
      required: false,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    enrollDate: {
      type: Date,
      required: true,
    },
    activity: [activitySchema],
    modules: [moduleSchema],
  },
  { timestamps: true }
);

studentSchema.index({ email: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ user: 1 });

const Student = model("Student", studentSchema);

module.exports = {
  getStudents: (id) => Student.find({ user: id }).sort({ createdAt: -1 }),
  getStudentById: (id) =>
    Student.findById(id),
  getStudentByEmailPhone: (email, phone) =>
    Student.findOne({ email: email, phone: phone }),
  addStudent: (values) => new Student(values).save().then((student) => student),
  editStudentById: (id, values) =>
    Student.findByIdAndUpdate(id, values, { upsert: true, new: true }),
  deleteStudentById: (id) => Student.findByIdAndDelete(id),
};
