class IndexCtrl {
    static indexLoggedAction(req, res) {
        res.render('indexAuthenticated.twig', {
            pseudo: req.session.user.pseudo,
        });
    }

    get(req, res) {
        let lang = "fr";
        
        if(req.cookies.i18n){lang = req.cookies.i18n}

        res.render('indexUnauthenticated.twig', {
            lang: lang,
        })
    }
}


module.exports = IndexCtrl;