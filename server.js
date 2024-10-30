const express = require("express");

// load env varibales
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = require("./config/database");
const expressConfig = require("./config/express");
const { PORT } = require("./config/env");
const logger = require("./config/logger");

const app = express();

function serve() {
  // mongo connect
  dbConnect();

  // load express configs
  expressConfig(app);

  // initialize app
  app.listen(PORT, () => {
    logger.info(`app-init port ${PORT}`);
  });
}

serve();

module.exports = app;
