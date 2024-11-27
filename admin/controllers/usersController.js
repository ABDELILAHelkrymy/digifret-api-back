const path = require("path");
const { getApiUrl } = require(path.join(adminAppRoot, "utils", "request"));
const ressourceName = "users";
const pageTitle = "Users API";
const listFiedls = ["_id", "fullname", "email", "role", "companyId.name"];
const ObjectId = require("mongoose").ObjectId;
const editFields = {
    _id: {
        type: "hidden",
    },
    fullname: {
        type: "text",
        label: "Full Name",
        disabled: true,
    },
    email: {
        type: "email",
        label: "Email",
        disabled: true,
    },
    role: {
        type: "text",
        label: "Role",
        disabled: true,
    },
    companyId: {
        type: "select",
        label: "Company",
        valuePath: "_id",
        labelPath: "name",
        options: {
            type: "api",
            ressourceName: "companies",
            value: "_id",
            label: "name",
        },
    },
};

const home = (req, res) => {
    const apiUrl = getApiUrl(req);
    const actions = [
        {
            name: "Edit",
            url: "/admin/api/users/edit/:_id",
            class: "btn btn-warning",
        },
    ];
    return res.status(200).render("api/users/home", {
        pageTitle,
        apiUrl,
        ressourceName,
        listFiedls,
        actions,
    });
};

const getEdit = async (req, res) => {
    let apiUrl = getApiUrl(req);
    apiUrl = `${apiUrl}/${req.params.id}`;
    const companyApi = getApiUrl(req, "companies");
    editFields.companyId.options.url = companyApi;

    const pageTitle = "Edit User";
    return res.status(200).render("api/users/edit", {
        pageTitle,
        apiUrl,
        ressourceName,
        editFields,
    });
};

const postEdit = async (req, res) => {
    const id = req.params.id;
    const apiUrl = getApiUrl(req) + "/" + id;
    const companyApi = getApiUrl(req, "companies");
    const { companyId } = req.body;
    try {
        if (companyId) {
            const companyModel = require(
                path.join(appRoot, "models", "companiesModel")
            );
            const company = await companyModel.findOne({
                _id: companyId,
            });
            if (!company) {
                throw new Error(`Company with id ${companyId} not found`);
            }
        }
        userModel = require(path.join(appRoot, "models", "usersModel"));
        const user = await userModel.findOne({ _id: id });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        user.companyId = companyId;
        await user.save();
        editFields.companyId.options.url = companyApi;

        return res.render("api/users/edit", {
            pageTitle: "Edit User",
            apiUrl,
            ressourceName,
            editFields,
            message: {
                class: "success",
                content: "User updated successfully",
            },
        });
    } catch (error) {
        return res.render("api/users/edit", {
            pageTitle: "Edit User",
            apiUrl,
            ressourceName,
            editFields,
            message: {
                class: "danger",
                content: error.message,
            },
        });
    }
};

module.exports = {
    home,
    getEdit,
    postEdit,
};
