const mongoose = require("mongoose");
const attachmentsEntity = require("./entities/attachmentsEntity");

attachmentsEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("attachments", attachmentsEntity);
