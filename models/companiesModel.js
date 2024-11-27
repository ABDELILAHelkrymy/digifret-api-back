const mongoose = require("mongoose");
const companiesEntity = require("./entities/companiesEntity");

companiesEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("companies", companiesEntity);
