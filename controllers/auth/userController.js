const asyncHandler = require("express-async-handler");
const path = require("path");
const User = require(path.join(appRoot, "models", "usersModel"));
const { errorUtil } = require(path.join(appRoot, "utils", "tools"));
const { authErrors } = require(path.join(appRoot, "config", "errorCodes"));

const updateWithProvider = asyncHandler(async (req, res) => {
    const { fullname, email, phone, role, provider, providerId } = req.body;

    if (!providerId || !provider) {
        throw errorUtil.generateError(authErrors.register.fields.missed);
    }

    let user = await User.findOne({ provider, providerId });

    if (!user) {
        user = await new User({
            fullname,
            email,
            providerId,
            provider,
            phone,
            role,
        });
    } else {
        user.fullname = fullname ?? user.fullname;
        user.email = email ?? user.email;
        user.phone = phone ?? user.phone;
        user.role = role ?? user.role;
    }

    if (user.fullname && user.email && user.phone && user.role) {
        user.isCompleted = true;
    } else {
        user.isCompleted = false;
    }

    await user.save();

    if (user) {
        res.status(201).json({
            user,
            token: req.token,
            status: "SUCCESS",
        });
    } else {
        throw errorUtil.generateError(authErrors.register.user.update);
    }
});

const getWithProvider = asyncHandler(async (req, res) => {
    const { provider, providerId } = req.body;

    if (!providerId || !provider) {
        throw errorUtil.generateError(authErrors.register.fields.missed);
    }

    const user = await User.findOne({ provider, providerId });

    if (user) {
        res.status(200).json({
            user,
            status: "SUCCESS",
            token: req.token,
        });
    } else {
        throw errorUtil.generateError(authErrors.profileErrors.notFound);
    }
});

module.exports = { updateWithProvider, getWithProvider };
