class UserCtrl {
    getWall(req, res) {
        res.render('wall.twig');
    }

    getUserInfo(req, res) {
        res.render('user.twig');
    }

    putUserInfo(req, res) {}
}

module.exports = UserCtrl;