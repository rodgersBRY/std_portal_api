const { default: mongoose } = require("mongoose");

const Schema = require("mongoose").Schema;

const userSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    fee_balance: {
      type: Number,
    },
    modules: [{ name: String, amount: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
