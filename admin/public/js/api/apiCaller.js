const callApi = async (url, method, data) => {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
    const body = JSON.stringify(data);
    const response = await fetch(url, { method, headers, body });
    const jsonRes = await response.json();
    if (jsonRes.token) {
        localStorage.setItem("token", jsonRes.token);
    }
    return jsonRes.data;
};

const apiCaller = {
    get: async (url) => {
        return await callApi(url, "GET");
    },
    post: async (url, data) => {
        return await callApi(url, "POST", data);
    },
    put: async (url, data) => {
        return await callApi(url, "PUT", data);
    },
    delete: async (url) => {
        return await callApi(url, "DELETE");
    },
};
