const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        plateNumber: { type: String, required: true },
        year: { type: Number, required: true },
        responsible: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        createdAt: { type: Date, immutable: true, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
