const path = require("path");
const smfs = require(path.join(appRoot, "utils", "tools")).fs;

const getPermissionConfig = () => {
    return smfs.read.yaml(
        path.join(appRoot, "config", "scripts", "permissions.yaml")
    );
};

const getUserPermission = () => {
    // to implement
};

const getRolePermission = () => {
    // to implement
};

module.exports = {
    getPermissionConfig,
    getUserPermission,
    getRolePermission,
};
