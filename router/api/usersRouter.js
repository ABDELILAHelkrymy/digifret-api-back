const router = require("express").Router();
const path = require("path");
const controller = require(
    path.join(appRoot, "controllers", "api", "usersController")
);

router.post("/search", controller.search);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
