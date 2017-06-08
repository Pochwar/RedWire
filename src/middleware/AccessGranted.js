// Middleware to restrict route access 

class AccessGranted  {

    // constructor save config
    constructor( defaultRole, moderatorRole, superAdminRole) {
        
        // roles
        this._defaultRole = defaultRole;
        this._moderatorRole = moderatorRole;
        this._superAdminRole = superAdminRole;

        // bind method to this
        this.everyone = this.everyone.bind(this);
        this.member = this.member.bind(this);
        this.moderator = this.moderator.bind(this);
        this.superAdmin = this.superAdmin.bind(this);
        this.render403 = this.render403.bind(this);
    }

    // public
    everyone(req, res, next) {
        next();
    }

    // can user access member's part ?
    member(req, res, next) {
        
        // invalid req
        if( !res.locals.user || !res.locals.user.roleId || res.locals.user.roleId < this._defaultRole) {
            this.render403(res);
        }
        else {
            next();
        }
    }

    // can user access admin ?
    moderator(req, res, next) {
        
        // invalid req
        if( !res.locals.user || ! res.locals.user.roleId || res.locals.user.roleId < this._moderatorRole) {
            this.render403(res);
        }
        else {
            next();
        }
    }

    // can user access super admin ?
    superAdmin(req, res, next) {

        // invalid req
        if( !res.locals.user || ! res.locals.user.roleId || res.locals.user.roleId < this._superAdminRole) {
            this.render403(res);
        }
        else {
            next();
        }
    }

    // render unauhtorized
    render403(res) {
        res.status(403).render('unauthorization.twig',{
            lang: res.locals.lang,
        });
    }
}

module.exports = AccessGranted;