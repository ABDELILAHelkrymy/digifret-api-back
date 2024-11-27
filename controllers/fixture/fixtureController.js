const { get } = require("http");
const path = require("path");
const smFs = require(path.join(appRoot, "utils", "tools")).fs;

const getModel = (ressource) => {
    return require(`../../models/${ressource}Model`);
};

const getFixtureConfig = (key = null) => {
    // read yaml file
    const config = smFs.read.yaml(
        path.join(appRoot, "config", "fixtures.yaml")
    );
    if (key)
        if (config[key]) return config[key];
        else return [];
    return config;
};

const resolveFixtureDatas = async (datas) => {
    let resolvedDatas = {};
    console.log("resolveFixtureDatas datas :>> ", datas);
    for (let key in datas) {
        console.log(`datas[${key}] :>> `, datas[key]);
        if (datas[key].value) {
            resolvedDatas[key] = datas[key].value;
        } else if (datas[key].ref) {
            let refModel = getModel(datas[key].ref);
            const query = {
                [datas[key].refField]: datas[key].refValue,
            };
            console.log("query :>> ", query);
            let refRessource = await refModel.findOne(query);
            console.log("refRessource :>> ", refRessource);
            console.log("datas[key] :>> ", datas[key]);
            console.log("datas[key].targetField :>> ", datas[key].targetField);
            if (refRessource)
                resolvedDatas[key] = refRessource[datas[key].targetField];
        }
    }
    return resolvedDatas;
};

const getRessourceIdentifier = (ressource) => {
    const identifiers = getFixtureConfig("identifiers");
    console.log("identifiers :>> ", identifiers);
    let identifier = identifiers[ressource];
    if (!identifier) identifier = "name";
    console.log(`identifier for ${ressource} :>> `, identifier);
    return identifier;
};

const createUsers = async (req, res) => {
    const ressourceName = "users";
    const ressourceIdentifier = "email";

    const config = getFixtureConfig(ressourceName);
    const model = getModel(ressourceName);
    let newRessources = [];
    for (let ressourceConfig of config) {
        const ressourceData = await resolveFixtureDatas(ressourceConfig);
        console.log("ressourceData :>> ", ressourceData);
        const query = {
            [ressourceIdentifier]: ressourceData[ressourceIdentifier],
        };
        console.log("query :>> ", query);
        let ressourceRes = await model.findOne(query);
        if (ressourceRes) {
            for (let key in ressourceData) {
                ressourceRes[key] = ressourceData[key];
            }
        } else {
            ressourceRes = await model.create(ressourceData);
        }
        // costumized actions start
        console.log("ressourceData.password :>> ", ressourceData.password);
        await ressourceRes.setPassword(ressourceData.password);
        // costumized actions end
        await ressourceRes.save();
        newRessources.push(ressourceRes);
    }
    res.json({ [ressourceName]: newRessources });
};

const createCompanies = async (req, res) => {
    const ressourceName = "companies";
    const ressourceIdentifier = "name";

    const config = getFixtureConfig(ressourceName);
    console.log("config :>> ", config);
    const model = getModel(ressourceName);
    let newRessources = [];
    for (let ressourceConfig of config) {
        const ressourceData = await resolveFixtureDatas(ressourceConfig);
        console.log("ressourceData :>> ", ressourceData);
        let ressourceRes = await model.findOne({
            [ressourceIdentifier]: ressourceData[ressourceIdentifier].value,
        });
        if (ressourceRes) {
            for (let key in ressourceData) {
                ressourceRes[key] = ressourceData[key];
            }
        } else {
            ressourceRes = await model.create(ressourceData);
        }
        await ressourceRes.save();
        newRessources.push(ressourceRes);
    }
    res.json({ [ressourceName]: newRessources });
};

const createDynamic = async (req, res) => {
    const ressourceName = req.params.ressource;
    const ressourceIdentifier = getRessourceIdentifier(ressourceName);

    const config = getFixtureConfig(ressourceName);
    const model = getModel(ressourceName);
    let newRessources = [];
    for (let ressourceConfig of config) {
        const ressourceData = await resolveFixtureDatas(ressourceConfig);
        console.log("ressourceData :>> ", ressourceData);
        let ressourceRes = await model.findOne({
            [ressourceIdentifier]: ressourceData[ressourceIdentifier].value,
        });
        if (ressourceRes) {
            for (let key in ressourceData) {
                ressourceRes[key] = ressourceData[key];
            }
        } else {
            ressourceRes = await model.create(ressourceData);
        }
        await ressourceRes.save();
        newRessources.push(ressourceRes);
    }
    res.json({ [ressourceName]: newRessources });
};

module.exports = {
    createUsers,
    createCompanies,
    createDynamic,
};
