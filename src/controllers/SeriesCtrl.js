class SeriesCtrl {
    get(req, res) {
        //Connected
        if (req.session.connected) {
            let lang = "fr";
            if(req.cookies.i18n){lang = req.cookies.i18n}

            res.render('series.twig', {
                lang: lang,
                pseudo: req.session.user.pseudo,
            })
        }
        //not connected
        else {
            res.render('unauthentication.twig',{});
        }
    }
}

module.exports = SeriesCtrl;