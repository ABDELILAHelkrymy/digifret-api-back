const mongoose = require("mongoose");
const maintenanceTypesEntity = require("./entities/maintenanceTypesEntity");

maintenanceTypesEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("maintenanceTypes", maintenanceTypesEntity);
