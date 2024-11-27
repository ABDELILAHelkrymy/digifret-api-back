const jsyaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const readYamlFile = (filePath) => {
    const yamlFileContent = fs.readFileSync(filePath, "utf8");

    let data = jsyaml.load(yamlFileContent);
    if (data === undefined) {
        data = {};
    }
    return data;
};

const getConfigPath = (fileName = "config") => {
    // check if the file name is a string and not empty
    if (typeof fileName !== "string" || fileName === "") {
        throw new Error("Invalid file name");
    }
    // check if the file exists
    const configPath = path.join(adminAppRoot, "config", fileName + ".yaml");
    if (!fs.existsSync(configPath)) {
        throw new Error(`Config file ${configPath} does not exist`);
    }
    return configPath;
};

const getConfig = (key = null, defaultValue = null, fileName = "config") => {
    const configPath = getConfigPath(fileName);
    let config;

    try {
        config = readYamlFile(configPath);
    } catch (e) {
        throw new Error(`Error reading config file: ${configPath}`);
    }

    if (key) {
        return config[key] || defaultValue;
    }
    return config;
};

const getRessourceConfig = (
    key = null,
    defaultValue = null,
    fileName = "ressources"
) => {
    return getConfig(key, defaultValue, fileName);
};

module.exports = {
    getConfig,
    getRessourceConfig,
};
