const path = require("path");
const { getRessourceConfig } = require(
    path.join(adminAppRoot, "utils", "config")
);

const getBaseUrl = (req) => {
    return req.protocol + "://" + req.get("host");
};

const validateRessourceName = (ressourceName) => {
    console.log("validateRessourceName: ", {ressourceName});
    if (typeof ressourceName !== "string" || ressourceName === "") {
        throw new Error("ressourceName must be a non-empty string");
    }
    const ressourceConfig = getRessourceConfig(ressourceName);
    if (!ressourceConfig) {
        throw new Error("ressource is not configured");
    }
    return true;
};

const getApiUrl = (req, ressource = null) => {
    let ressourceName;
    if (!ressource) {
        ressourceName = req.originalUrl.split("/")[3];
        console.log(ressourceName);
        console.log(req.originalUrl.split("/"));
    } else {
        ressourceName = ressource;
    }
    if (validateRessourceName(ressourceName)) {
        return getBaseUrl(req) + "/api/V1/" + ressourceName;
    }
};

module.exports = {
    getBaseUrl,
    getApiUrl,
};
