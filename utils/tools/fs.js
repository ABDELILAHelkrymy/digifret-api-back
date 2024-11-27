const fs = require("fs");
const jsyaml = require("js-yaml");

const smfs = {
    file: {
        exists: function (filePath, ext = ".js") {
            let completFilePath = filePath + ext;
            try {
                fs.accessSync(completFilePath, fs.constants.F_OK);
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        },
        removeExtension: function (filePath) {
            if (filePath && filePath.includes(".")) {
                return filePath.split(".").slice(0, -1).join(".");
            } else {
                return filePath;
            }
        },
        getExtension: function (filePath) {
            return filePath.split(".").pop();
        },
        rename: function (oldPath, newPath) {
            return new Promise((resolve, reject) => {
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        reject(err);
                    }
                    resolve("File Renamed!");
                });
            });
        },
    },
    read: {
        file: function (filePath) {
            return fs.readFileSync(filePath, "utf8");
        },
        yaml: function (filePath) {
            try {
                const yamlFileContent = fs.readFileSync(filePath, "utf8");

                let data = jsyaml.load(yamlFileContent);
                if (data === undefined) {
                    data = {};
                }
                return data;
            } catch (error) {
                console.log(`Error reading YAML file: ${error.message}`);
                return null;
            }
        },
    },
};

module.exports = smfs;
