const router = require("express").Router();
const path = require("path");
const controller = require(
    path.join(adminAppRoot, "controllers", "usersController")
);

router.get("/", controller.home);
router.get("/edit/:id", controller.getEdit);
// router.post("/search", controller.search);
router.post("/edit/:id", controller.postEdit);
// router.delete("/:id", controller.remove);

module.exports = router;
