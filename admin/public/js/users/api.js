const getAllUsers = async (apiUrl) => {
    const searchQuery = {
        query: [
            {
                key: "role",
                value: "driver",
            },
        ],
    };
    return new Promise(async (resolve, reject) => {
        try {
            const users = await apiCaller.post(apiUrl + "/search", searchQuery);
            console.log("users from api: ", users);
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

const getUserById = async (apiUrl) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await apiCaller.get(apiUrl);
            console.log("user from api: ", user);
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
};
