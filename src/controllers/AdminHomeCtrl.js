class AdminHomeCtrl {
    get(req, res) {
        res.render('admin.twig');
    }
}

module.exports = AdminHomeCtrl;