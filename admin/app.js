const request = require("../utils/request");
const express = require("express");
const path = require("path");

const app = express();
global.adminAppRoot = __dirname;

app.all("*", (req, res, next) => {
    request.logReq(req);
    next();
});

const sessionMiddleware = require(
    path.join(appRoot, "middlewares", "sessionMiddleware")
);

app.use(express.static(path.join(adminAppRoot, "public")));

app.use(sessionMiddleware.init());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", require("./router/authRouter"));
app.use("/api", require("./router/apiRouter"));

// set the view engine to ejs
app.set("view engine", "ejs");
// set the views directory
app.set("views", adminAppRoot + "/views");

module.exports = app;
