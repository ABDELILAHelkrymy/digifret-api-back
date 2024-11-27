const request = require("./utils/request");
const {
    errorHandler,
    notFoundHandler,
} = require("./middlewares/errorMiddleware");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.all("*", (req, res, next) => {
    request.logReq(req);
    next();
});

// import all models for eventuel populate use
require("./models/attachmentsModel");
require("./models/trucksModel");
require("./models/tripsModel");
require("./models/maintenancesModel");
require("./models/maintenanceTypesModel");
require("./models/companiesModel");
require("./models/locationsModel");

app.use("/auth", require("./router/authRouter"));
app.use("/api", require("./router/apiRouter"));
if (process.env.NODE_ENV !== "production") {
    app.use("/fixture", require("./router/fixtureRouter"));
}

// Log Part
// set the view engine to ejs
app.set("view engine", "ejs");
// set the views directory
app.set("views", "./views");
const bodyParser = require("body-parser");
const sessionMiddleware = require("./middlewares/sessionMiddleware");
app.use(
    "/log",
    bodyParser.urlencoded({ extended: true }),
    sessionMiddleware.init(),
    require("./router/logRouter")
);
const adminApp = require("./admin/app");
app.use("/admin", adminApp);

app.use(notFoundHandler, errorHandler);

const expressListEndpoints = require('express-list-endpoints');
console.log(expressListEndpoints(adminApp));

module.exports = app;
