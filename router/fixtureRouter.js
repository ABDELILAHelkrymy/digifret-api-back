const router = require("express").Router();
const path = require("path");
const fixtureController = require(
    path.join(appRoot, "controllers", "fixture", "fixtureController")
);
const authMiddleware = require(
    path.join(appRoot, "middlewares", "authMiddleware")
);
router.use(
    "/",
    authMiddleware.verifyJWT,
    authMiddleware.verifyRole("super-admin")
);
router.get("/create-users", fixtureController.createUsers);
router.get("/create-companies", fixtureController.createCompanies);
router.get("/create-dynamic/:ressource", fixtureController.createDynamic);

module.exports = router;
