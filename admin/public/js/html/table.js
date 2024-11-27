// work with bs5 classes
const getTableHeader = (fields) => {
    console.log("getTableHeader fields : ", fields);

    const thead = document.createElement("thead");
    thead.classList.add("table-dark");
    console.log("getTableHeader thead : ", thead);

    const tr = document.createElement("tr");
    tr.classList.add("text-center");
    console.log("getTableHeader tr : ", tr);

    fields.forEach((field) => {
        const th = document.createElement("th");
        if (field.includes(".")) field = field.replace(".", " - ");
        th.textContent = field;
        tr.appendChild(th);
        console.log(`getTableHeader th : ${field} : `, th);
    });
    thead.appendChild(tr);
    return thead;
};

const getFieldValue = (item, field) => {
    console.log("getFieldValue item : ", item);
    console.log("getFieldValue field : ", field);
    let value;
    if (field.includes(".")) {
        const fields = field.split(".");
        value = item;
        fields.forEach((f) => {
            value = value[f] ?? "";
        });
    } else {
        value = item[field];
    }
    console.log("getFieldValue value : ", value);
    return value;
};

const getTableBody = (data, fields, actions) => {
    const tbody = document.createElement("tbody");
    console.log("getTableBody tbody : ", tbody);
    data.forEach((item) => {
        const tr = document.createElement("tr");
        fields.forEach((field) => {
            const td = document.createElement("td");
            const value = getFieldValue(item, field);
            td.textContent = value;
            tr.appendChild(td);
        });
        console.log("getTableBody tr before action : " + item._id + " : ", tr);

        if (actions) {
            const actionsTd = getActionsTd(item, actions);
            tr.appendChild(actionsTd);
        }
        console.log("getTableBody tr : " + item._id + " : ", tr);
        tbody.appendChild(tr);
    });
    return tbody;
};

const getActionsTd = (item, actions) => {
    const td = document.createElement("td");
    console.log("getActionsTd td : ", td);
    console.log("getActionsTd actions : ", actions);
    actions.forEach((action) => {
        console.log("getActionsTd action : ", action);
        const button = document.createElement("button");
        if (action.class) {
            console.log("getActionsTd action.class : ", action.class);
            button.classList = action.class;
        }
        console.log("getActionsTd td after class : ", td);
        if (action.icon) {
            const icon = document.createElement("i");
            icon.classList.add(action.icon);
            button.appendChild(icon);
        }
        console.log("getActionsTd td after icon : ", td);
        if (action.name) {
            button.textContent = action.name;
        }
        console.log("getActionsTd td after name : ", td);
        if (action.url) {
            button.addEventListener("click", () => {
                window.location.href = getUrl(action.url, item);
            });
        }
        console.log("getActionsTd td after url : ", td);
        if (action.callback) {
            button.addEventListener("click", () => {
                if (typeof action.callback !== "function") {
                    console.error(
                        "Callback must be a function for action: ",
                        action
                    );
                } else {
                    action.callback(item);
                }
            });
        }
        console.log("getActionsTd td after callback : ", td);
        td.appendChild(button);
    });
    return td;
};

const getUrl = (url, item) => {
    let newUrl = url;
    const keys = Object.keys(item);
    keys.forEach((key) => {
        newUrl = newUrl.replace(`:${key}`, item[key]);
    });
    return newUrl;
};

const getHtmlTable = (data, fields, actions = null) => {
    console.log("getHtmlTable input : ", { data, fields, actions });
    const table = document.createElement("table");
    table.classList = "table table-striped table-hover table-bordered";
    console.log("getHtmlTable tabele : ", table);

    const headerFields = actions ? fields.concat(["Actions"]) : fields;
    const thead = getTableHeader(headerFields);
    console.log("getHtmlTable thead : ", thead);
    table.appendChild(thead);

    const tbody = getTableBody(data, fields, actions);
    console.log("getHtmlTable tbody : ", tbody);
    table.appendChild(tbody);

    return table;
};
