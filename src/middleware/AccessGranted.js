// Middleware to restric access 
const jwt = require('jsonwebtoken');

class AccessGranted  {

    // constructor save config
    constructor( defaultRole, moderatorRole, superAdminRole) {
        this._defaultRole = defaultRole;
        this._moderatorRole = moderatorRole;
        this._superAdminRole = superAdminRole;

        // bind method to this
        this.everyone = this.everyone.bind(this);
        this.member = this.member.bind(this);
        this.moderator = this.moderator.bind(this);
        this.superAdmin = this.superAdmin.bind(this);
        this.extractTokenInfo = this.extractTokenInfo.bind(this);
        this.render403 = this.render403.bind(this);
    }

    // public
    everyone(req, res, next) {
        this.extractTokenInfo(req, res);
        next();
    }

    // can user access member's part ?
    member(req, res, next) {
        if( this.extractTokenInfo(req, res) && res.locals.user.roleId >= this._defaultRole) {
            next();
        }
        else {
            this.render403(res);
        }
    }

    // can user access admin ?
    moderator(req, res, next) {
        
        if( this.extractTokenInfo(req, res) && res.locals.user.roleId >= this._moderatorRole) {
            next();
        }
        else {
            this.render403(res);
        }
    }

    // can user access super admin ?
    superAdmin(req, res, next) {

        if( this.extractTokenInfo(req, res) && res.locals.user.roleId >= this.__superAdminRole) {
            next();
        }
        else {
            this.render403(res);
        }
    }

    // validate token
    extractTokenInfo(req, res) {
        
        try {
            res.locals.user = jwt.verify(req.cookies.token, 'secret');
            return true;
        } catch(err) {
             return false;
        }
    }

    // render unauhtorized
    render403(res) {
        res.status(403).render('unauthorization.twig',{});
    }
}

module.exports = AccessGranted;