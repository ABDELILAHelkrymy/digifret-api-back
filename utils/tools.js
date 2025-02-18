const path = require("path");
global.appRoot = path.resolve(__dirname, "..");
const logger = require("./tools/logger");
const tracker = require("./tools/tracker");
const date = require("./tools/date");
const fs = require("./tools/fs");
const errorUtil = require("./tools/errorUtil");
const object = require("./tools/object");

function loadModule(module) {
    const modulePath = path.resolve(__dirname, "../", module);
    if (fs.file.exists(modulePath)) {
        const moduleContent = require(modulePath);
        return moduleContent;
    }
}

function loadModuleMethod(module, method) {
    const moduleContent = loadModule(module);
    if (moduleContent) {
        const methodContent = moduleContent[method] ?? null;
        return methodContent;
    }
}

function logReq(req) {
    const APP_ENV = process.env.APP_ENV;
    if (APP_ENV !== "production") {
        console.log({ "new Req": `\n${("=".repeat(190) + "\n").repeat(3)}` });
        console.log("#".repeat(150));
        console.log("*".repeat(30) + "       " + req.method + " - " + req.url);
        // console.log(`Env : ${APP_ENV}`)
        // console.log('req.headers :', req.headers);
        console.log("req.body :", req.body);
        // console.log(`req.query : `, req.query)
        // console.log(`req.params : `, req.params)
        // console.log(`req.headers.authorization : `, req.headers.authorization)
        console.log("*".repeat(150));
        console.log("#".repeat(150));
    }
}

const getMiddlewaresFromConfig = (entityName) => {
    const path = require("path");

    const middlewaresConfigFilePath = path.resolve(
        __dirname,
        "../config/middlewares.yaml"
    );

    const middlewaresConfig = fs.read.yaml(middlewaresConfigFilePath);
    let routerMiddlewares = [];
    if (middlewaresConfig)
        routerMiddlewares = middlewaresConfig[entityName] ?? [];
    return routerMiddlewares;
};

module.exports = {
    date,
    logger,
    fs,
    object,
    errorUtil,
    loadModule,
    loadModuleMethod,
    logReq,
    getMiddlewaresFromConfig,
    tracker,
};
