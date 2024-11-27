const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
            required: true,
        },
        entity: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "entityName",
            required: true,
        },
        entityName: {
            type: String,
            required: true,
            enum: ["trips", "trucks", "maintenances"],
        },
        name: { type: String },
        url: { type: String, required: true, default: "NOT_AVAILABLE" },
        isFavorite: { type: Boolean },
        createdAt: { type: Date, immutable: true, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
