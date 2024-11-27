const jwt = require("jsonwebtoken");
const path = require("path");

const logger = require(path.join(appRoot, "utils", "tools")).logger.log();
const filter = require(path.join(appRoot, "utils", "tools", "object")).filter;

const payloadFields = ["_id", "email", "role", "companyId", "fullname", "isCompleted"];

const getTokenFromReq = (req) => {
    const authorization =
        req.headers["authorization"] || req.headers["Authorization"];
    if (authorization?.startsWith("Bearer ") && authorization.split(" ")[1]) {
        return authorization.split(" ")[1];
    }
    return null;
};

const getFilteredPayload = (payload) => {
    let filteredPayload = {};
    if (payload) {
        filteredPayload = filter(payload, payloadFields);
    }
    return filteredPayload;
};

const generateToken = (payload) => {
    let token = {};
    payload = getFilteredPayload(payload);
    if (payload && Object.keys(payload).length !== 0) {
        token.payload = payload;
        token.token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
    }
    logger.log(token, "generateToken - token");
    return token;
};

const verifyToken = (token) => {
    token = token ?? "";
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
            // console.log("verifyToken verify token error: ", error);
            // console.log("verifyToken verify token payload: ", payload);
            if (error) reject(error);
            else resolve(generateToken(payload));
        });
    });
};

module.exports = {
    generateToken,
    verifyToken,
    getTokenFromReq,
};
