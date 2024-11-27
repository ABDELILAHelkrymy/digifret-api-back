const path = require("path");

const getLogDir = () => {
    return path.join(appRoot, "logs");
};

const listLogFiles = (req, res) => {
    const fs = require("fs");
    const logDir = getLogDir();
    let files = [];
    if (fs.existsSync(logDir)) {
        files = fs.readdirSync(logDir);
        files = files.map((file) => {
            return file.split(".")[0];
        });
    }

    return res.status(200).render("log/list", {
        title: "Log Files",
        files,
    });
};

const displayLogFile = (req, res) => {
    const fs = require("fs");
    const logDir = getLogDir();
    const fileName = req.params.fileName;
    let content = "";
    const filePath = path.join(logDir, `${fileName}.log`);
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, "utf8");
    }

    return res.status(200).render("log/file", {
        title: "Log File",
        fileName,
        content,
    });
};

const login = (req, res) => {
    if (req.session.logged) {
        return res.redirect("/log");
    }
    return res.status(200).render("log/login", {
        title: "Login",
    });
};

const loginPost = (req, res) => {
    const password = req.body.password;

    console.log("user password", password);
    console.log("env password", process.env.LOG_PASSWORD);

    if (password === process.env.LOG_PASSWORD) {
        console.log("Logged in");
        req.session.logged = true;
        return res.redirect("/log");
    } else {
        console.log("Invalid password");
        return res.status(401).render("log/login", {
            title: "Login",
            message: "Invalid password",
        });
    }
};

const deleteLogFiles = (req, res) => {
    const password = req.body.password;
    if (password !== process.env.LOG_PASSWORD) {
        return res.status(401).json({
            title: "Login",
            message: "Invalid password",
            code: "INVALID_PASSWORD",
        });
    }

    console.log("Deleting all log files");

    const fs = require("fs");
    const logDir = getLogDir();
    let files = [];
    if (fs.existsSync(logDir)) {
        files = fs.readdirSync(logDir);
        files.forEach((file) => {
            fs.unlinkSync(path.join(logDir, file));
            console.log(`Deleted file ${file}`);
        });
    }
    res.json({ message: "Deleted all log files", success: true });
};

const deleteLogFile = (req, res) => {
    const fs = require("fs");
    const logDir = getLogDir();
    const fileName = req.params.fileName;
    const filePath = path.join(logDir, `${fileName}.log`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file ${fileName}`);
    }
    res.redirect("/log");
};

module.exports = {
    listLogFiles,
    displayLogFile,
    login,
    loginPost,
    deleteLogFiles,
    deleteLogFile,
};
