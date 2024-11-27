const asyncHandler = require("express-async-handler");
const jwt = require("../utils/jwt");
const { errorUtil } = require("../utils/tools");
const { authErrors } = require("../config/errorCodes");

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = jwt.getTokenFromReq(req);
    let errorMessage = "Access denied. No token provided.";
    if (token) {
        await jwt
            .verifyToken(token)
            .then((data) => {
                req.user = data.payload;
                req.token = data.token;
                errorMessage = null;
                next();
            })
            .catch((err) => {
                errorMessage = err.message;
            });
    }
    if (errorMessage) {
        let errorConfig;
        if (errorMessage === "jwt expired")
            errorConfig = authErrors.midlleware.token.expired;
        else errorConfig = authErrors.midlleware.token.other;
        throw errorUtil.generateError({
            ...errorConfig,
            message: errorMessage,
        });
    }
});

const verifyOneRole = (...allowedRoles) => {
    return asyncHandler((req, res, next) => {
        const userRoles = req.user.role;
        const isAllowed = userRoles
            .map((role) => allowedRoles.includes(role))
            .find((val) => val === true);
        if (!isAllowed) {
            throw errorUtil.generateError(authErrors.midlleware.roles.oneRole);
        }
        next();
    });
};

const verifyRole = (allowedRole) => {
    return asyncHandler((req, res, next) => {
        if (allowedRole !== req.user.role) {
            throw errorUtil.generateError(authErrors.midlleware.roles.oneRole);
        }
        next();
    });
};

const verifyAllRoles = (...allowedRoles) => {
    return asyncHandler((req, res, next) => {
        const userRoles = req.user.roles;
        const isDenied = allowedRoles
            .map((role) => !userRoles.includes(role))
            .find((val) => val === true);
        if (isDenied) {
            throw errorUtil.generateError(authErrors.midlleware.roles.allRoles);
        }
        next();
    });
};

module.exports = { verifyJWT, verifyOneRole, verifyAllRoles, verifyRole };
