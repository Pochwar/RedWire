class SeriesCtrl {
    get(req, res) {
        res.render('series.twig', {
            lang: res.locals.lang,
            pseudo: res.locals.user.pseudo,
        })
    }
}

module.exports = SeriesCtrl;