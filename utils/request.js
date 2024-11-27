const { getTrackedFunction } = require("./tools/tracker");

const getBaseUrl = (req) => {
    const protocol = req.protocol;
    const hostname = req.hostname;
    // const port = req.port;
    return `${protocol}://${hostname}`;
};

const getGoogleRedirectUrl = (req) => {
    const baseUrl = getBaseUrl(req);
    return baseUrl + "/auth/v1/google/callback";
};

const getFacebookRedirectUrl = (req) => {
    const baseUrl = getBaseUrl(req);
    return baseUrl + "/auth/v1/facebook/callback";
};

const getSuccessResponse = (req, data = null) => {
    return { data, status: "SUCCESS", token: req.token };
};

const logReq = (req) => {
    if (!req) return;
    const excludedUrls = ["/log", "/api-docs", "/swagger", "/favicon"];
    for (const url of excludedUrls) {
        if (req.url.includes(url)) return;
    }
    const fileLogger = require("./tools/fileLogger");
    fileLogger.log(
        {
            url: req.url,
            method: req.method,
            body: req.body,
            query: req.query,
            params: req.params,
        },
        "Request",
        0
    );
};

const getDbQueryFromReqQuery = (reqQuery) => {
    const query = {};
    if (reqQuery) {
        reqQuery.forEach((item) => {
            if (!item.key) return;
            const operator = item.value ? item.operator || "eq" : "required";
            switch (operator) {
                case "eq":
                    query[item.key] = item.value;
                    break;
                case "regex":
                    query[item.key] = new RegExp(item.value, "i");
                    break;
                case "required":
                    query[item.key] = { $exists: true };
                    break;
                case "gt":
                    query[item.key] = { $gt: item.value };
                    break;
                case "lt":
                    query[item.key] = { $lt: item.value };
                    break;
                case "gte":
                    query[item.key] = { $gte: item.value };
                    break;
                case "lte":
                    query[item.key] = { $lte: item.value };
                    break;
                default:
                    break;
            }
        });
    }
    return query;
};

module.exports = {
    logReq,
    getBaseUrl,
    getGoogleRedirectUrl,
    getFacebookRedirectUrl,
    getSuccessResponse,
    getDbQueryFromReqQuery: getTrackedFunction(
        "getDbQueryFromReqQuery",
        getDbQueryFromReqQuery
    ),
};
