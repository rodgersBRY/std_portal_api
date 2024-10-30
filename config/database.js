const mongoose = require("mongoose");
const logger = require("../config/logger");
const { MONGO_URI } = require("../config/env");

const db = () =>
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      logger.info("db-init-success");
    })
    .catch((err) => {
      logger.error(`db-init-error: ${err}`);
    });

module.exports = db;
