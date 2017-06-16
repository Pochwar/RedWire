class LangCtrl {
    constructor(conf){
        this._conf = conf;
    }

    changeLang(req, res){
        const langs = this._conf.site.lang;
        const lang = req.params.lang;
        let langOk = false;
        for(let key in langs) {
            if (lang === langs[key]){
                langOk = true;
            }
        }
        if (langOk){
            //change language cookie
            const langService = req.app.get('langService');
            langService.sendCookie(res, lang);

            //redirect (need linking between series translation)
            // if(req.headers.referer !== undefined){
            //     res.redirect(req.headers.referer);
            // } else {
            //     res.redirect('/');
            // }

            res.redirect('/');
        } else {
            const error = res.__('ERROR_SERVER');
            return res.status(400).render('error.twig', {status: 400, error,});
        }
    }

}

module.exports = LangCtrl;
