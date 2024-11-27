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
        truckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "trucks",
            required: true,
        },
        responsible: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        date: { type: Date, required: true },
        description: { type: String },
        maintenanceTypesId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "maintenanceTypes",
            required: true,
        },
        createdAt: { type: Date, immutable: true, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
