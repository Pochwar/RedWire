class SeriesCtrl {
    get(req, res) {
        let lang = "fr";
        if(req.cookies.i18n){lang = req.cookies.i18n}

        res.render('series.twig', {
            lang: lang,
            pseudo: req.session.user.pseudo,
        })
    }
}

module.exports = SeriesCtrl;