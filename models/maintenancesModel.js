const mongoose = require("mongoose");
const maintenancesEntity = require("./entities/maintenancesEntity");

maintenancesEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("maintenances", maintenancesEntity);
