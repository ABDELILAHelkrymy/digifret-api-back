const router = require("express").Router();
const path = require("path");
const controller = require(
    path.join(adminAppRoot, "controllers", "authController")
);

router.get("/login", controller.login);
router.post("/login", controller.postLogin);
router.get("/logout", controller.logout);

module.exports = router;
