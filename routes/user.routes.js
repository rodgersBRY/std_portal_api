const router = require("express").Router();

const userController = require("../controllers/user.controller");
const authGuard = require("../authguard");

router.get("/modules", userController.getModules);

module.exports = router;
