const login = async (req, res) => {
    return res.status(200).render("auth/login", {
        pageTitle: "Login",
        username: "superadmin",
        password: "",
    });
};

const postLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).render("auth/login", {
            pageTitle: "Login",
            error: "Please provide username and password!",
        });
    }
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        let apiLoginUrl =
            req.protocol + "://" + req.get("host") + "/auth/v1/login";
        let apiLoginRes = await fetch(apiLoginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: process.env.SUPERADMIN_EMAIL,
                password: process.env.SUPERADMIN_PASSWORD,
            }),
        });
        let apiLoginData = await apiLoginRes.json();
        req.session.isLoggedIn = true;
        return res.status(200).render("admin/login", {
            apiLoginData,
        });
    } else {
        return res.status(401).render("auth/login", {
            pageTitle: "Login",
            error: "Email or password is incorrect!",
            username,
            password,
        });
    }
};

const logout = async (req, res) => {
    req.session.isLoggedIn = false;
    return res.status(200).render("auth/logout");
};

module.exports = {
    login,
    postLogin,
    logout,
};
