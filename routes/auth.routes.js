const router = require("express").Router();

const { registerUser, login } = require("../controllers/auth.controller");

router.post("/register", registerUser);

router.post("/login", login);

module.exports = router;
