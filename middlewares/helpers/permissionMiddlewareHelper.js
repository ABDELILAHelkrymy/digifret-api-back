const path = require("path");
const { ObjectId } = require("mongoose").Types;
const smfs = require(path.join(appRoot, "utils", "tools")).fs;
const smRequest = require(path.join(appRoot, "utils", "request"));
const logger = require(path.join(appRoot, "utils", "tools")).logger.log();
const { getTrackedExports } = require(
    path.join(appRoot, "utils", "tools", "tracker")
);

const getPermissionsConfig = () => {
    const configFilePath = path.join(appRoot, "config", "permissions.yaml");
    const permissionsConfig = smfs.read.yaml(configFilePath);
    if (!permissionsConfig) {
        const message = `No permissions configuration found in ${configFilePath}`;
        throw new Error(message);
    }
    return smfs.read.yaml(configFilePath);
};

const getAction = (originalUrl, method) => {
    const logTitle = "PermissionMiddleware - getAction";
    let action;
    let id;
    const idPositionValue = originalUrl.split("/")[4];

    // check if the id is valid ObjectId or action
    if (idPositionValue) {
        if (ObjectId.isValid(idPositionValue)) {
            id = idPositionValue;
        } else {
            action = idPositionValue;
            return action;
        }
    }

    // the action is the classic CRUD method. (getById, getAll, create, update, delete)
    switch (method.toUpperCase()) {
        case "GET":
            if (id) action = "getById";
            else action = "getAll";
            break;
        case "POST":
            action = "create";
            break;
        case "PUT":
            action = "update";
            break;
        case "DELETE":
            action = "delete";
            break;
        default:
            action = "unknown";
            break;
    }
    return action;
};

const checkUserProps = (propsUser, user) => {
    let isAuthorized = true;
    for (let propUser of propsUser) {
        let userPropValue = user[propUser.prop];
        let { validation, value, prop } = propUser;
        if (!validation) validation = "required";
        if (!value && validation !== "required") {
            return false;
        }
        switch (validation) {
            case "required":
                isAuthorized = userPropValue !== undefined;
                break;
            case "equals":
                isAuthorized = userPropValue === value;
                break;
            case "different":
                isAuthorized = userPropValue !== value;
                break;
            case "contains":
                isAuthorized = userPropValue.includes(value);
                break;
            case "containedIn":
                isAuthorized = value.includes(userPropValue);
                break;
            default:
                break;
        }
        if (!isAuthorized) {
            return false;
        }
    }
    return isAuthorized;
};

const getPropValue = (obj, prop) => {
    let propValue = obj[prop];
    if (propValue === undefined) {
        propValue = obj;
        let props = prop.split(".");
        for (let p of props) {
            propValue = propValue[p];
            if (propValue === undefined) break;
        }
    }
    return propValue;
};

const checkRelationFields = (propsRelation, user, ressource) => {
    if (!propsRelation) return true;

    let { userProp, ressourceProp, relation } = propsRelation;
    if (!userProp) userProp = "_id";
    if (!ressourceProp) ressourceProp = "userId";
    if (!relation) relation = "equals";

    let userPropValue = getPropValue(user, userProp);
    let ressourcePropValue = getPropValue(ressource, ressourceProp);
    if (ressourcePropValue instanceof ObjectId)
        ressourcePropValue = ressourcePropValue.toString();

    if (!userPropValue || !ressourcePropValue) {
        return false;
    }

    let isAuthorized = false;

    switch (relation) {
        case "equals":
            isAuthorized = userPropValue === ressourcePropValue;
            break;
        case "different":
            isAuthorized = userPropValue !== ressourcePropValue;
            break;
        case "contains":
            isAuthorized = userPropValue.includes(ressourcePropValue);
            break;
        case "containedIn":
            isAuthorized = ressourcePropValue.includes(userPropValue);
            break;
        default:
            break;
    }
    return isAuthorized;
};

const getAllowedFields = (model, fieldsConfig) => {
    let ressourceFields = Object.keys(model.schema.obj);
    ressourceFields = ["_id", ...ressourceFields];
    let allowedFields = ressourceFields;
    if (!fieldsConfig) {
        allowedFields = ressourceFields;
    } else if (fieldsConfig.allowed) {
        allowedFields = ressourceFields.filter((key) =>
            fieldsConfig.allowed.includes(key)
        );
    } else if (fieldsConfig.denied) {
        allowedFields = ressourceFields.filter(
            (key) => !fieldsConfig.denied.includes(key)
        );
    }
    return allowedFields;
};

const mustfetchData = (action, id) => {
    if (ObjectId.isValid(id)) return true;
    return ["getAll", "search"].includes(action);
};

const getFindQuery = (user, roleAuthConfig, action, ressourceId) => {
    const propsRelation = roleAuthConfig.propsRelation;
    if (!propsRelation && !ressourceId) {
        return {};
    }
    if (ressourceId) {
        return { _id: ressourceId };
    }

    let { userProp, ressourceProp, relation } = propsRelation;
    if (!userProp) userProp = "_id";
    if (!ressourceProp) ressourceProp = "userId";
    if (!relation) relation = "equals";

    let findQuery = {};
    if (ressourceProp.includes(".")) return {};
    const userPropValue = getPropValue(user, userProp);
    switch (relation) {
        case "equals":
            findQuery[ressourceProp] = userPropValue;
            break;
        case "different":
            findQuery[ressourceProp] = { $ne: userPropValue };
            break;
        case "contains":
            findQuery[ressourceProp] = { $in: userPropValue };
            break;
        case "containedIn":
            findQuery[ressourceProp] = { $in: [userPropValue] };
            break;
        default:
            break;
    }
    if (!userPropValue) {
        findQuery = { undefined: "undefined" };
    }
    return findQuery;
};

const getFindQueryForSearch = (query, findQuery) => {
    if (!query) return findQuery;
    let costumizedQuery = smRequest.getDbQueryFromReqQuery(query);
    return { ...costumizedQuery, ...findQuery };
};

const getPermissionConfig = (ressourceName, action, role) => {
    const permissionsConfig = getPermissionsConfig();
    const logTitle = "PermissionMiddleware - getPermissionConfig";
    let permissionConfig;
    try {
        permissionConfig = permissionsConfig[ressourceName][action];
        if (!permissionConfig && action === "search") {
            permissionConfig = permissionsConfig[ressourceName]["getAll"];
        }
        if (!permissionConfig)
            throw new Error(
                `No permission configuration found for ${ressourceName} for the action ${action}`
            );
        if (permissionConfig.enabled === false)
            throw new Error(
                `Permission configuration for ${ressourceName} for the action ${action} is not enabled`
            );
        if (!permissionConfig[role])
            throw new Error(
                `No permission configuration found for ${role} for the action ${action}`
            );
    } catch (error) {
        logger.log(error.message, logTitle + " - error");
        return null;
    }
    return permissionConfig[role];
};

const getModel = (ressourceName) => {
    try {
        return require(path.join(appRoot, "models", `${ressourceName}Model`));
    } catch (error) {
        throw new Error(`Model ${ressourceName}Model not found in /models`);
    }
};

const getId = (url) => {
    let id = null;
    let urlParts = url.split("/");
    urlParts.forEach((part) => {
        if (part.includes("?")) part = part.split("?")[0];
        if (ObjectId.isValid(part)) id = part;
    });
    return id;
};

const getPopulatedData = async (model, findQuery, propsPopulate) => {
    const logTitle = "PermissionMiddleware - getPopulatedData";
    let dbData = await model.find(findQuery);
    if (dbData.length === 0) return null;
    let populatedData = dbData;
    if (!Array.isArray(dbData)) populatedData = [dbData];
    for (let i = 0; i < populatedData.length; i++) {
        for (let propPopulate of propsPopulate) {
            populatedData[i] = await model.populate(
                populatedData[i],
                propPopulate
            );
        }
    }
    return populatedData;
};

const getRessourceName = (url) => {
    let ressourceName = url.split("/")[3] ?? null;
    return ressourceName;
};

const getReqItmes = (method, originalUrl) => {
    const id = getId(originalUrl);
    const action = getAction(originalUrl, method);
    const ressourceName = getRessourceName(originalUrl);
    return { id, action, ressourceName };
};

module.exports = getTrackedExports({
    getPermissionsConfig,
    getAction,
    checkUserProps,
    getPropValue,
    checkRelationFields,
    getAllowedFields,
    mustfetchData,
    getFindQuery,
    getFindQueryForSearch,
    getPermissionConfig,
    getModel,
    getId,
    getPopulatedData,
    getRessourceName,
    getReqItmes,
});
