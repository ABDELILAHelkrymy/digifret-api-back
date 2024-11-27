const session = require("express-session");
const router = require("express").Router();

const secret = process.env.SESSION_SECRET || "secret";
const cookie = { maxAge: process.env.SESSION_MAX_AGE || 12 * 60 * 60 * 1000 };
const sessionOptions = session({
    saveUninitialized: true,
    resave: false,
    secret,
    cookie,
});

const sessionMiddleware = (req, res, next) => {
    console.log("Session: ");
    console.log("Date now (iso): " + new Date().toISOString());
    console.log("Session ID: " + req.sessionID);
    // console.log("Session: ", req.session);
    if (req.session) {
        req.session.touch();
    } else {
        console.log("No session");
    }
    next();
};

const isLoggedIn = (redirectUri = "/login") => {
    return (req, res, next) => {
        console.log("isLoggedIn: ", req.session?.isLoggedIn);
        console.log("redirectUri: ", redirectUri);
        if (req.session?.isLoggedIn) {
            next();
        } else {
            return res.redirect(redirectUri);
        }
    };
};

router.use(sessionOptions, sessionMiddleware);

module.exports = {
    init: () => router,
    isLoggedIn,
};
