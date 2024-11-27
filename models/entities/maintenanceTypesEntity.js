const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        name: { type: String, required: true },
        createdAt: { type: Date, immutable: true, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);
