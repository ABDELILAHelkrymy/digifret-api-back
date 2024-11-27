const asyncHandler = require("express-async-handler");
const path = require("path");
const smtRequest = require(path.join(appRoot, "utils", "request"));
const smtObject = require(path.join(appRoot, "utils", "tools")).object;
const smtConfig = require(path.join(appRoot, "utils", "config"));
const smtController = require(path.join(appRoot, "utils", "controller"));
const logger = require(path.join(appRoot, "utils", "tools")).logger.log();
const ressourceName = { single: "user", plural: "users" };

const getById = asyncHandler(async (req, res) => {
    const dataKey = ressourceName["single"];
    const data = { [dataKey]: req.ressource };

    res.json(smtRequest.getSuccessResponse(req, data));
});

const getAll = asyncHandler(async (req, res) => {
    const dataKey = ressourceName["plural"];
    const data = { [dataKey]: req.ressources };

    res.json(smtRequest.getSuccessResponse(req, data));
});

const update = asyncHandler(async (req, res) => {
    const ressource = req.ressource;
    const allowedFields = req.allowedFields;

    const allowedFieldsGiven = smtObject.getExistingAllowedFields(
        req.body,
        allowedFields
    );

    allowedFieldsGiven.forEach((field) => {
        ressource[field] = req.body[field];
    });
    await ressource.save();
    const data = { [ressourceName["single"]]: ressource };

    res.json(smtRequest.getSuccessResponse(req, data));
});

const remove = asyncHandler(async (req, res) => {
    const ressource = req.ressource;
    await ressource.remove();
    const data = { message: `${ressourceName["single"]} removed successfully` };

    res.json(smtRequest.getSuccessResponse(req, data));
});

const search = asyncHandler(async (req, res) => {
    const dataKey = ressourceName["plural"];
    const data = { [dataKey]: req.ressources };

    res.json(smtRequest.getSuccessResponse(req, data));
});

module.exports = {
    getById,
    getAll,
    update,
    remove,
    search,
};
