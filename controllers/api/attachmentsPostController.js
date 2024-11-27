const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { bucket } = require(path.join(appRoot, "services", "firebase"));

const logger = require(path.join(appRoot, "utils", "tools")).logger.log();
const smfs = require(path.join(appRoot, "utils", "tools")).fs;
const errorUtil = require(path.join(appRoot, "utils", "tools")).errorUtil;
const { attachmentsError } = require(
    path.join(appRoot, "config", "errorCodes")
);

const uploadToCostumize = asyncHandler(async (req, res) => {
    const logTitle = "attachmentsController uploadToFirebase";
    if (!req.file) {
        throw errorUtil.generateError(attachmentsError.upload.fileMissed);
    }

    const resUpload = await bucket.upload(req.file.path, {
        destination: destinationPath,
    });
    fs.unlinkSync(req.file.path);
    logger.log(
        "File uploaded to firebase storage : " + resUpload[0].metadata.name,
        logTitle
    );
    res.json({ message: "File uploaded successfully." });
});

const downloadToCostumize = asyncHandler(async (req, res) => {
    const logTitle = "attachmentsController downloadFromFirebase";
    if (!req.body.filename) {
        throw errorUtil.generateError(attachmentsError.download.filenameMissed);
    }
    const storage = admin.storage();
    const bucket = storage.bucket("gs://transport-app-demo.appspot.com");
    const filename = `files/${req.body.filename}`;
    const file = bucket.file(filename);
    const fileData = await file.download();
    logger.log("fileData recieved from firebase : " + fileData[0], logTitle);
    res.send(fileData[0]);
});

const upload = asyncHandler(async (req, res) => {
    const file = req.file;
    const ressource = req.resData.data.attachment;
    if (!file) {
        throw errorUtil.generateError(attachmentsError.upload.fileMissed);
    }
    const destinationPath = `files/${req.user.companyId}/${Date.now() + "_" + req.file.originalname}`;
    try {
        const uploadRes = await bucket.upload(file.path, {
            destination: destinationPath,
        });
        const url = uploadRes[0].metadata.name;
        ressource.url = url;
    } catch (error) {
        ressource.remove();
        res.status(500).json({
            message: "Error while uploading file.",
            token: req.token,
            error: error.message,
        });
    }
    ressource.save();
    fs.unlinkSync(file.path);
    req.resData.data.message = "File uploaded successfully.";
    res.json({ ...req.resData });
});

const download = asyncHandler(async (req, res) => {
    const attachment = req.resData.data.attachment;

    const url = attachment.url;
    if (!url) {
        res.status(404).json({
            message: "Attachment not dosen't contain a url.",
            token: req.token,
        });
    }
    const file = await bucket.file(url);
    const fileData = await file.download();
    res.send(fileData[0]);
});

module.exports = {
    upload,
    download,
};
