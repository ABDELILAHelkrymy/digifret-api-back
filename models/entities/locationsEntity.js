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
        name: { type: String, required: true },
        phone: { type: String },
        email: { type: String },
        address: { type: String, required: true },
        latitude: { type: String },
        longitude: { type: String },
        createdAt: { type: Date, immutable: true, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
