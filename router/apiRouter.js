const path = require("path");
const router = require("express").Router();

const authMiddleware = require(
    path.join(appRoot, "middlewares", "authMiddleware")
);
const permissionMiddleware = require(
    path.join(appRoot, "middlewares", "permissionMiddleware")
);

router.use(
    "/v1",
    authMiddleware.verifyJWT,
    permissionMiddleware.checkPermissions
);
router.use("/v1/attachments", require("./api/attachmentsRouter"));
router.use("/v1/companies", require("./api/companiesRouter"));
router.use("/v1/locations", require("./api/locationsRouter"));
router.use("/v1/maintenance-types", require("./api/maintenanceTypesRouter"));
router.use("/v1/maintenances", require("./api/maintenancesRouter"));
router.use("/v1/trips", require("./api/tripsRouter"));
router.use("/v1/trucks", require("./api/trucksRouter"));
router.use("/v1/users", require("./api/usersRouter"));

module.exports = router;
