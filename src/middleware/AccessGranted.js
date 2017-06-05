// Middleware to restric access 

class AccessGranted  {

    // constructor save config
    constructor( defaultRole, moderatorRole, superAdminRole) {
        this._defaultRole = defaultRole;
        this._moderatorRole = moderatorRole;
        this._superAdminRole = superAdminRole;

        // bind method to this
        this.toSite = this.toSite.bind(this);
        this.toAdmin = this.toAdmin.bind(this);
        this.toSuperAdmin = this.toSuperAdmin.bind(this);
    }

    // can user access site ?
    toSite(req, res, next) {
       
         if( req.session.connected && req.session.user.roleId >= this._defaultRole) {
             next();
         }
         else {
             res.redirect('/unauthorized');
         }
    }

    // can user access admin ?
    toAdmin(req, res, next) {
        
        if( req.session.connected && req.session.user.roleId >= this._moderatorRole) {
            next();
        }
        else {
            res.redirect('/unauthorized');
        }
    }

    // can user access super admin ?
    toSuperAdmin(req, res, next) {

        if( req.session.connected && req.session.user.roleId >= this.__superAdminRole) {
            next();
        }
        else {
            res.redirect('/unauthorized');
        }
    }
    
}

module.exports = AccessGranted;