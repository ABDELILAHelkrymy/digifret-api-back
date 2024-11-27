const mongoose = require("mongoose");
const locationsEntity = require("./entities/locationsEntity");

locationsEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("locations", locationsEntity);
