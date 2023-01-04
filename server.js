const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

require("dotenv").config();

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// connect to mongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongoDB connected");
  });

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data,
  });
});

<<<<<<< HEAD
=======
// api endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

>>>>>>> 3caa7577a082d8aa221483cc36d6e7bc8b5cf102
app.listen(process.env.PORT, () => {
  console.log("app running on port 4000");
});
