const cors = require("cors");
const logger = require("morgan");
const { json, urlencoded } = require("express");

const authRoutes = require("../routes/auth");
const studentRoutes = require("../routes/student");

const expressConfig = (app) => {
  // app resources
  app
    .use(logger("dev"))
    .use(cors())
    .use(json())
    .use(urlencoded({ extended: false }));

  /* app routes
  api endpoints */
  let resources = [
    { path: "/api/auth", resource: authRoutes },
    { path: "/api/students", resource: studentRoutes },
  ];

  resources.forEach((res) => {
    app.use(res.path, res.resource);
  });
};

module.exports = expressConfig
