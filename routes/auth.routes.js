const router = require("express").Router();
const { body, check } = require("express-validator");

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

module.exports = router;
