const { Router } = require("express");
const router = Router();
const path = require("path");
const authMiddleware = require(
    path.join(appRoot, "middlewares", "authMiddleware")
);
const loginController = require(
    path.join(appRoot, "controllers", "auth", "loginController")
);
const googleController = require(
    path.join(appRoot, "controllers", "auth", "googleController")
);
const facebookController = require(
    path.join(appRoot, "controllers", "auth", "facebookController")
);

router.route("/v1/login").post(loginController.login);
router.route("/v1/register").post(loginController.register);
router
    .route("/v1/register-trans-email")
    .post(loginController.registerTransEmail);
router.route("/v1/register-trans").post(loginController.registerTransProvider);

router.route("/v1/google/authorize").post(googleController.authorize);
router.route("/v1/google/callback").post(googleController.callback);

router.route("/v1/facebook/authorize").post(facebookController.authorize);
router.route("/v1/facebook/callback").post(facebookController.callback);

module.exports = router;
