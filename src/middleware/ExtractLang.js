class ExtractLang {

    constructor( defaultLang) {
        this._defaultLang = defaultLang;

        this.fromCookies = this.fromCookies.bind(this);
    }

    fromCookies(req, res, next) {
        
        if(req.cookies.i18n){
            res.locals.lang = req.cookies.i18n;
        }
        else {
            res.locals.lang = this._defaultLang;
        }

        next();
    }
}

module.exports = ExtractLang;