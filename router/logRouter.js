const router = require("express").Router();
const path = require("path");
const logController = require("../controllers/log/logController");

router.route("/login").get(logController.login);
router.route("/login").post(logController.loginPost);

router.use("/", (req, res, next) => {
    if (req.session.logged) {
        next();
    } else {
        return res.redirect("/log/login");
    }
});

router.route("/").get(logController.listLogFiles);
router.route("/files/:fileName").get(logController.displayLogFile);
router.route("/delete").delete(logController.deleteLogFiles);
router.route("/delete/:fileName").get(logController.deleteLogFile);

module.exports = router;
