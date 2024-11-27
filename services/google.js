const { OAuth2Client } = require("google-auth-library");
const path = require("path");
const logger = require(path.join(appRoot, "utils", "tools")).logger.log();

const getOauthClient = (redirect_uri) => {
    logger.log(
        "Google Oauth client creating.",
        "Google Oauth : getOauthClient"
    );
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri
    );
};

exports.getGoogleClient = getOauthClient;
