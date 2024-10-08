const express = require("express"),
  cors = require("cors"),
  logger = require("morgan");

require("dotenv").config();

const dbConnect = require("./services/db_config"),
  authRoutes = require("./routes/auth"),
  studentRoutes = require("./routes/student");

const app = express();

const port = process.env.PORT || 4000;

// mongo connect
dbConnect();

app
  .use(logger("dev"))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }));

// api endpoints
let resources = [
  { path: "/api/auth", resource: authRoutes },
  { path: "/api/students", resource: studentRoutes },
];

resources.forEach((res) => {
  app.use(res.path, res.resource);
});

// error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data;
  res.status(status).json({
    message,
    data,
  });
});

app.listen(port, () => {
  console.log("Jarvis is up and running: " + port);
});

module.exports = app;
