const router = require("express").Router();
const path = require("path");
const sessionMiddleware = require(
    path.join(appRoot, "middlewares", "sessionMiddleware")
);

const adminController = require(
    path.join(adminAppRoot, "controllers", "adminController")
);
router.use(sessionMiddleware.isLoggedIn("/admin/auth/logout"));

router.get("/", adminController.home);
router.use("/users", require("./api/usersRouter"));

module.exports = router;
