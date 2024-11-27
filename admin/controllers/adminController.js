const home = (req, res) => {
    return res.status(200).render("admin/home", {
        pageTitle: "Home",
    });
};

module.exports = {
    home,
};
