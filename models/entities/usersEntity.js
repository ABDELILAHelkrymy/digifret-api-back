const mongoose = require("mongoose");
const rolesList = require("../../config/roles");

module.exports = mongoose.Schema(
    {
        fullname: {
            type: "String",
            trim: true,
            maxlength: [50, "max characters is 20!"],
            minlength: [2, "min characters is 2!"],
        },
        email: {
            type: "String",
            unique: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Invalid email address format",
            },
        },
        password: {
            type: "String",
            minlength: [2, "min characters is 2!"],
        },
        image: {
            type: "String",
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        role: {
            type: "String",
            enum: [...rolesList],
            default: rolesList?.[0],
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
        },
        resetPasswordToken: {
            type: "String",
        },
        provider: {
            type: "String",
        },
        providerId: {
            type: "String",
        },
        isCompleted: {
            type: "Boolean",
            default: false,
        },
        resetPasswordTokenExpires: {
            type: "Date",
        },
    },
    { timestaps: true }
);
