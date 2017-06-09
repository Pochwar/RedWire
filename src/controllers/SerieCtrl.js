class SerieCtrl {
    get(req, res) {
        let lang = "fr";
        if(req.cookies.i18n){lang = req.cookies.i18n}

        res.render('serie.twig', {
            lang: lang,
            pseudo: req.session.user.pseudo,
        })
    }
}

module.exports = SerieCtrl;