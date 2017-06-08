class ExtractLang {

    static fromCookies(req, res, next) {
        
        // default
        res.locals.lang = req.app.get('conf').site.default.lang;

        // extract data from cookies
        if(req.cookies && req.cookies.i18n) {
            res.locals.lang = req.cookies.i18n;
        }

        // fallback to user default lang
        else if (res.locals.user && res.locals.user.lang) {
            res.locals.lang = res.locals.user.lang;
        }

        next();
    }
}

module.exports = ExtractLang;