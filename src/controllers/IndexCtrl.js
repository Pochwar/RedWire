export default class IndexCtrl {
    get(req, res) {
        //Connected
        if (req.session.connected) {
            let lang = "fr";
            if(req.cookies.i18n){lang = req.cookies.i18n}

            res.render('indexAuthenticated.twig', {
                lang: lang,
                pseudo: req.session.user.pseudo
            })
        }
        //not connected
        else {
            res.render('indexUnauthenticated.twig',{});
        }
    }
}
