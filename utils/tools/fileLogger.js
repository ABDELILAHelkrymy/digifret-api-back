const fs = require("fs");
const path = require("path");

const getFormattedData = (data) => {
    let formattedData = "";
    if (typeof data === "object") {
        formattedData += JSON.stringify(data, null, 2);
    } else {
        formattedData += data;
    }
    formattedData += "\n";
    return formattedData;
};

const getFormattedDate = () => {
    return new Date().toISOString();
};

const getLogContent = (title, data) => {
    const fullLine = "-".repeat(200) + "\n";
    let logContent = "\n";
    logContent += fullLine;
    logContent += `${"-".repeat(20)} ${Date.now()} - ${getFormattedDate()} - ${title}`;
    logContent += "\n";
    logContent += getFormattedData(data);
    logContent += fullLine;
    return logContent;
};

const addTabToEachLine = (content, nbTabs) => {
    if (typeof content !== "string") {
        throw new Error("content must be a string");
    }
    if (isNaN(nbTabs) || nbTabs < 0) {
        throw new Error("nbTabs must be a positive number");
    }
    if (nbTabs === 0) {
        return content;
    }
    const tab = "    ";
    const tabContent = tab.repeat(nbTabs);
    return content.replace(/\n/g, `\n${tabContent}`);
};

const getFilePathTime = (delay, currentTime = 0) => {
    if (isNaN(delay) || delay <= 0) {
        throw new Error("delay must be a positive number");
    } else if (isNaN(currentTime) || currentTime < 0) {
        throw new Error("currentTime must be a positive number");
    } else if (currentTime === 0) {
        currentTime = Date.now();
    }
    delay *= 1000;
    return (currentTime - (currentTime % delay)) / delay;
};

const getLogPath = () => {
    logDeley = process.env.LOG_DELAY ?? 3600;
    const logFileTime = getFilePathTime(logDeley);
    const logFileName = `log_${logFileTime}.log`;
    const logPath = path.join(appRoot, "logs", logFileName);
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "");
    }
    return logPath;
};

const saveLog = (logContent) => {
    const logPath = getLogPath();
    fs.appendFile(logPath, logContent, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

const log = (data, title, nbTabs = 1) => {
    let logContent = getLogContent(title, data, nbTabs);
    logContent = addTabToEachLine(logContent, nbTabs);

    saveLog(logContent);
};

module.exports = {
    log,
};
