require("dotenv").config();
require("dotenv").config({ path: ".env.local" });

const logger = require("./utils/tools").logger.log();
const db = require("./config/db");
db.connect();

const app = require("./app");
let port = process.env.PORT || 5000;

module.exports = app.listen(port, () => {
    logger.log(
        `Server is running and listening on port : ${port}.`,
        "Server starting"
    );
});
