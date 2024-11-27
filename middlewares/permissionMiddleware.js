const { ObjectId } = require("mongoose").Types;
const path = require("path");
const fileLogger = require(path.join(appRoot, "utils", "tools", "fileLogger"));
const {
    getPermissionConfig,
    getModel,
    getFindQuery,
    getFindQueryForSearch,
    getPopulatedData,
    getAllowedFields,
    mustfetchData,
    getReqItmes,
    checkUserProps,
    checkRelationFields,
} = require("./helpers/permissionMiddlewareHelper");

const smtObject = require(path.join(appRoot, "utils", "tools", "object"));
const logger = require(path.join(appRoot, "utils", "tools", "logger"));

const checkPermissions = async (req, res, next) => {
    const { method, originalUrl } = req;
    const { id, action, ressourceName } = getReqItmes(method, originalUrl);
    if (!ressourceName) {
        res.status(404).json({ message: "Ressource not found! invalid url!" });
    }
    const logTitle = "PermissionMiddleware";
    const { user } = req;
    const { role } = user;
    logger.log(user, logTitle + " - user");

    if (action === "unknown") {
        logger.log(`Unknown action for ${ressourceName}`, logTitle);
        return next();
    }

    // get the permission configuration
    const roleAuthConfig = getPermissionConfig(ressourceName, action, role);
    let errorMessage = `You don't have the permission on ${ressourceName} to ${action}.`;
    if (!roleAuthConfig) {
        logger.log(errorMessage + " no config for this role!", logTitle);
        return res.status(403).json({ message: errorMessage });
    } else if (roleAuthConfig.enabled === false) {
        logger.log(errorMessage + " not enabled!", logTitle);
        return res.status(403).json({ message: errorMessage });
    }

    // check propsUser permission
    if (roleAuthConfig.propsUser) {
        let isAuthorized = checkUserProps(roleAuthConfig.propsUser, user);
        if (!isAuthorized) {
            logger.log(errorMessage + " propsUser!", logTitle);
            return res.status(403).json({ message: errorMessage });
        }
    }
    // get the model and the ressource(s) data
    const model = getModel(ressourceName);
    let dbData;

    if (mustfetchData(action, id)) {
        if (id && ["getById", "update", "delete"].includes(action)) {
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: `The id ${id} is not valid!`,
                });
            }
        }

        let findQuery = getFindQuery(user, roleAuthConfig, action, id);
        if (action === "search") {
            findQuery = getFindQueryForSearch(req.body.query, findQuery);
        }

        if (roleAuthConfig.propsPopulate) {
            dbData = await getPopulatedData(
                model,
                findQuery,
                roleAuthConfig.propsPopulate,
                id
            );
        } else {
            dbData = await model.find(findQuery);
        }
        logger.log(dbData, logTitle + " - ressource data");
        if (id) {
            if (!dbData || (Array.isArray(dbData) && dbData.length === 0)) {
                return res.status(404).json({
                    message: `There is no ${ressourceName} with id ${id}`,
                });
            } else if (Array.isArray(dbData)) {
                dbData = dbData[0];
            }
        }
    }
    // check the relation fields for the case of a single ressource
    if (dbData && !Array.isArray(dbData)) {
        let isAuthorized = checkRelationFields(
            roleAuthConfig.propsRelation,
            user,
            dbData
        );
        if (!isAuthorized) {
            const message = `You don't have the permission '${action}' on ressource with id ${id}!`;
            logger.log(message, logTitle);
            return res.status(403).json({ message });
        }
    } else if (dbData && Array.isArray(dbData)) {
        // filter the ressource(s) data with the relation fields
        dbData = dbData.filter((ressource) =>
            checkRelationFields(roleAuthConfig.propsRelation, user, ressource)
        );
    }

    // fit the request object with the model and the ressource(s) data
    req.model = model;
    req.allowedFields = getAllowedFields(model, roleAuthConfig.fields);
    if (dbData) {
        // filter the ressource(s) data with the allowed fields in read mode
        if (action !== "update")
            dbData = smtObject.filter(dbData, req.allowedFields);
        if (Array.isArray(dbData)) req.ressources = dbData;
        else req.ressource = dbData;
        fileLogger.log(req.ressource, logTitle + " - ressource");
        fileLogger.log(req.ressources, logTitle + " - ressources");
    }
    return next();
};

module.exports = { checkPermissions };
