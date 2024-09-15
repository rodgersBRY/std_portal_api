const mongoose = require("mongoose");

const db = () => mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:\n", err);
  });

module.exports = db;
