const router = require("express").Router();

const userController = require("../controllers/user.controller");
const authGuard = require("../authguard");

router.get("/", userController.getModules);

module.exports = router;
