class ProfileCtrl {
    get(req, res) {
        res.render('profile.twig')
    }
}

module.exports = ProfileCtrl;