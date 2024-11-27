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
        originId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "locations",
            required: true,
        },
        destinationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "locations",
            required: true,
        },
        date: { type: Date },
        status: {
            type: String,
            enum: [
                "pending",
                "in-progress",
                "completed",
                "canceled",
                "scheduled",
            ],
            default: "pending",
        },
        description: { type: String },
        distance: { type: Number },
        price: { type: Number },
        weight: { type: Number },
        noPallets: { type: Number },
        createdAt: { type: Date, immutable: true, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
