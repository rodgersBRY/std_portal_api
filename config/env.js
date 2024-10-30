const MONGO_URI = process.env["MONGO_URI"];
const PORT = process.env["PORT"];
const JWT_SECRET_TOKEN = process.env["JWT_SECRET_TOKEN"];
const NODE_ENV = process.env["NODE_ENV"];
const LOG_LEVEL = process.env["LOG_LEVEL"];
const MORGAN_BODY_MAX_BODY_LENGTH = process.env["MORGAN_BODY_MAX_BODY_LENGTH"];
const EXPRESS_BODY_LIMIT = process.env["EXPRESS_BODY_LIMIT"];

module.exports = {
  MONGO_URI,
  PORT,
  JWT_SECRET_TOKEN,
  NODE_ENV,
  LOG_LEVEL,
  MORGAN_BODY_MAX_BODY_LENGTH,
  EXPRESS_BODY_LIMIT,
};
