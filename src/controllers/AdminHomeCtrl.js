class AdminHomeCtrl {
    get(req, res) {
        let lang = "fr";
        
        if(req.cookies.i18n){lang = req.cookies.i18n}

        res.render('admin.twig', {
            lang: lang,
            pseudo: req.session.user.pseudo,
        })
    }
}

module.exports = AdminHomeCtrl;