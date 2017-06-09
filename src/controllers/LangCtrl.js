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

            //redirect
            if(req.headers.referer !== undefined){
                res.redirect(req.headers.referer);
            } else {
                res.redirect('/');
            }
        } else {
            res.status(404);
            res.render('404.twig', {
                url: req.url,
            })
        }
    }

}

module.exports = LangCtrl;
