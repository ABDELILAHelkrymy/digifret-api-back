const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync("uploads") === false) {
            fs.mkdirSync("uploads");
        }
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        console.log("storage filename cb:", file);
        cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    },
});

module.exports = multer({ storage: storage });
