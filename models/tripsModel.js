const mongoose = require("mongoose");
const tripsEntity = require("./entities/tripsEntity");

tripsEntity.pre("save", function (next) {
    if (this.isNew) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("trips", tripsEntity);
