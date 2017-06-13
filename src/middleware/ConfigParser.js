class ConfigParser {

    constructor( conf) {
        this._conf = conf;

        this.toLocals = this.toLocals.bind(this);
    }

    toLocals(req, res, next) {
        res.locals.config = {};
        res.locals.config.defaultPoster = this._conf.site.default.poster;
        next();
    }
}

module.exports = ConfigParser;