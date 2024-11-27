const path = require("path");
const logger = require(path.join(appRoot, "utils", "tools")).logger.log();

const getFbClient = (redirectUri) => {
    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const authorizeUrl = "https://www.facebook.com/v19.0/dialog/oauth";
    const tokenUrl = "https://graph.facebook.com/v19.0/oauth/access_token"
    const userDataUrl = "https://graph.facebook.com/v19.0/me"
    const logTitle = "Facebook Oauth Client";

    return {
        getAuthorizationUrl: () => {
            logger.log("getAuthorizationUrl clientId : " + clientId);
            return `${authorizeUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email`;
        },
        getAccessToken: async (code) => {
            const response = await fetch(
                `${tokenUrl}?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`
            );
            const data = await response.json();
            logger.log(
                "getAccessToken data: " + JSON.stringify(data),
                logTitle
            );
            return data.access_token;
        },
        getUserData: async (accessToken) => {
            const response = await fetch(
                `${userDataUrl}?fields=id,name&access_token=${accessToken}`
            );
            const data = await response.json();
            logger.log("getUserData data: " + JSON.stringify(data), logTitle);
            return data;
        },
    };
};

exports.getFbClient = getFbClient;
