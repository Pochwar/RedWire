// middleware to check cookies
class LangService {

    constructor( conf) {
        this._conf = conf;

        this.checkCookies = this.checkCookies.bind(this);
        this.getUserLang = this.getUserLang.bind(this);
        this.setLocale = this.setLocale.bind(this);
        this.sendCookie = this.sendCookie.bind(this);
    }

    checkCookies(req, res, next) {
        
        // conf
        const cookieName =  this._conf.site.cookies.i18nName;

        // if no cookie, fallback to user default lang if we can
        if ( (!req.cookies || !req.cookies[cookieName] ) && res.locals.user ) {
           
            // get default lang
            const lang = this.getUserLang(res.locals.user)
            
            // set locale lang
            this.setLocale(res, lang);
            
            // send new cookie 
            this.sendCookie(res, lang);
        }

        next();
    }

    getUserLang(user) {

        // default langId
        let langId = this._conf.site.default.langId;
       
        // user's langId
        if( user.langId ) {
            langId = user.langId;
        }
        // check that langId is correct
        if( !langId in this._conf.site.lang ) {
            langId = Object.keys(this._conf.site.lang)[0];
        }
        
        return this._conf.site.lang[langId];
    }

    setLocale(res, lang) {
        res.locals.locale = lang;
    }

    sendCookie(res, lang) {
        res.cookie(  this._conf.site.cookies.i18nName,  lang, { 
            maxAge:  this._conf.site.cookies.maxAge, 
            httpOnly: true 
        });
    }
}

module.exports = LangService;