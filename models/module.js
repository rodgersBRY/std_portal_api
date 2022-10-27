const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
  },
  topics: [
    {
      title: {
        type: String,
        required: true,
      },
    },
  ],
  feeAmount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Module", moduleSchema);
