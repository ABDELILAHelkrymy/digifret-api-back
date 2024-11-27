const getRequiredFields = (entityConfig) => {
    return entityConfig.fields
        .filter((field) => field.required && !field.fromUser && !field.default)
        .map((field) => field.name);
};

const getAllowedFields = (entityConfig) => {
    return entityConfig.fields.map((field) => field.name);
};

const getExistingAllowedFields = (data, allowedFields) => {
    return Object.keys(data).filter((field) => allowedFields.includes(field));
};

const getMissedRequiredFields = (data, requiredFields) => {
    return requiredFields.filter((field) => !Object.keys(data).includes(field));
};

const checkRequiredFields = (entityConfig, data) => {
    const requiredFields = getRequiredFields(entityConfig);
    const missedRequiredFields = getMissedRequiredFields(data, requiredFields);
    return missedRequiredFields.length > 0 ? missedRequiredFields : null;
};

const fitWithUserData = (entityConfig, resource, user) => {
    entityConfig.fields.forEach((field) => {
        if (field.fromUser) {
            if (user[field.fromUser] !== undefined) {
                resource[field.name] = user[field.fromUser];
            } else if (field.default) {
                resource[field.name] = field.default;
            } else if (field.required) {
                throw new Error(
                    `Field ${field.name} is required and does not have a default value or a value from user.`
                );
            } else {
                resource[field.name] = null;
            }
        }
    });
    return resource;
};

module.exports = {
    getRequiredFields,
    getAllowedFields,
    getExistingAllowedFields,
    getMissedRequiredFields,
    checkRequiredFields,
    fitWithUserData,
};
