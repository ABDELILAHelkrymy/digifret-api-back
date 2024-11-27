const mongoose = require("mongoose");
const trucksEntity = require("./entities/trucksEntity");

trucksEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("trucks", trucksEntity);
