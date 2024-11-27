const asyncHandler = require("express-async-handler");
const path = require("path");
const smtRequest = require(path.join(appRoot, "utils", "request"));
const smtObject = require(path.join(appRoot, "utils", "tools")).object;
const smtConfig = require(path.join(appRoot, "utils", "config"));
const smtController = require(path.join(appRoot, "utils", "controller"));
const logger = require(path.join(appRoot, "utils", "tools")).logger.log();
const ressourceName = { single: "company", plural: "companies" };

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

const create = asyncHandler(async (req, res) => {
    // Check if entity config exists in entities.yaml
    const entityConfig = smtConfig.getEntityConfig(ressourceName["plural"]);
    if (!entityConfig) {
        return res.status(500).json({
            message: `Interne error. Entity ${ressourceName["plural"]} not found in entities.yaml`,
        });
    }

    // Check if required fields are present
    const missedRequiredFields = smtController.checkRequiredFields(
        entityConfig,
        req.body
    );
    if (missedRequiredFields) {
        return res.status(400).json({
            message: `Missing required fields: ${missedRequiredFields.join(", ")}`,
        });
    }

    // get allowed fields values from body
    const allowedFieldsGiven = smtObject.filter(req.body, req.allowedFields);
    // create new ressource with allowed fields values given
    let ressource = new req.model(allowedFieldsGiven);
    // fit ressource with user data
    ressource = smtController.fitWithUserData(
        entityConfig,
        ressource,
        req.user
    );
    // save ressource
    await ressource.save();
    // return success response
    const data = { [ressourceName["single"]]: ressource };

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
    create,
    update,
    remove,
    search,
};
