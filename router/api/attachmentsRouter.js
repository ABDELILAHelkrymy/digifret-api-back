const router = require("express").Router();
const path = require("path");
const controller = require(
    path.join(appRoot, "controllers", "api", "attachmentsController")
);
const postController = require(
    path.join(appRoot, "controllers", "api", "attachmentsPostController")
);

router.get("/download/:id", controller.download, postController.download);
router.post("/search", controller.search);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
const upload = require(path.join(appRoot, "middlewares", "uploadMiddleware"));
router.post(
    "/",
    upload.single("file"),
    controller.create,
    postController.upload
);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
