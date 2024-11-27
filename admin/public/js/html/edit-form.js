const getOptionsFromApi = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await apiCaller.get(url);

            resolve(data);
        } catch (error) {
            console.error("getOptionsFromApi error: ", error);
            reject(error);
        }
    });
};

const getInput = (key, field, value) => {
    let input = document.createElement("input");
    if (field.type === "select") {
        input = getSelect(key, field, value);
    } else {
        input = getTextField(key, field, value);
    }

    return input;
};

const getValue = (path, value) => {
    let resolvedValue = value || "";
    if (path) {
        path = path.split(".");

        let obj = value;
        // ccheck if obj is not null or undefined
        if (obj === null || obj === undefined) {
            obj = {};
        }
        path.forEach((key) => {
            obj = obj[key] ?? "";
        });
        resolvedValue = obj || "";
    }

    return resolvedValue;
};

const getSelect = (key, field, value) => {
    const select = document.createElement("select");
    select.id = key;
    select.name = key;
    select.classList = "form-control select";
    select.required = field.required || false;
    select.disabled = field.disabled || false;

    const defaultOption = document.createElement("option");
    defaultOption.value = getValue(field.valuePath, value);
    defaultOption.textContent = getValue(field.labelPath, value);
    select.appendChild(defaultOption);

    if (field.options.type === "api") {
        // Get options from api
        getOptionsFromApi(field.options.url)
            .then((data) => {
                data[field.options.ressourceName].forEach((company) => {
                    const optionElement = document.createElement("option");
                    optionElement.value = company[field.options.value];
                    optionElement.textContent = company[field.options.label];
                    select.appendChild(optionElement);
                });
            })
            .catch((error) => {
                console.error("getOptionsFromApi error: ", error);
            });
    } else {
        // Get options from field
        field.options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            select.appendChild(optionElement);
        });
    }

    return select;
};

const getTextField = (key, field, value) => {
    const input = document.createElement("input");
    input.type = field.type || "text";
    input.id = key;
    input.name = key;
    input.value = value;

    input.classList = "form-control";
    input.required = field.required || false;
    input.disabled = field.disabled || false;

    return input;
};

const getFormGroup = (key, field, value) => {
    const formGroup = document.createElement("div");
    formGroup.classList = "form-group";

    // Create label
    if (field.type !== "hidden") {
        const label = document.createElement("label");
        label.classList = "form-label";
        label.for = key;
        label.textContent = field.label || key;
        formGroup.appendChild(label);
    }
    // Create input
    const input = getInput(key, field, value);
    formGroup.appendChild(input);

    // Create hidden input for disabled fields to be sent
    if (field.type !== "hidden" && field.disabled) {
        const hiddenInput = getTextField(key, { type: "hidden" }, value);
        formGroup.appendChild(hiddenInput);
    }

    return formGroup;
};

const getEditForm = (data, fields) => {
    const form = document.createElement("form");
    form.id = "edit-form";
    form.classList = "form";
    form.method = "POST";

    for (const key in fields) {
        const formGroup = getFormGroup(key, fields[key], data[key]);
        form.appendChild(formGroup);
    }

    // Add line break
    form.appendChild(document.createElement("br"));

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.classList = "btn btn-warning";
    submitButton.textContent = "Save";
    form.appendChild(submitButton);

    // Create hidden input for token
    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "token";
    tokenInput.value = localStorage.getItem("token");
    form.appendChild(tokenInput);

    return form;
};
