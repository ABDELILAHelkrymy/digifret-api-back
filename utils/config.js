const path = require("path");
const smfs = require(path.join(appRoot, "utils", "tools")).fs;

const getEntitiesConfig = () => {
    return smfs.read.yaml(
        path.join(appRoot, "config", "scripts", "entities.yaml")
    );
};

const getEntityConfig = (entity) => {
    const entitiesConfig = getEntitiesConfig();
    return entitiesConfig[entity] ?? null;
};

module.exports = {
    getEntitiesConfig,
    getEntityConfig,
};
