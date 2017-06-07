// Middleware to restric access 

class AccessGranted  {

    // constructor save config
    constructor( defaultRole, moderatorRole, superAdminRole) {
        this._defaultRole = defaultRole;
        this._moderatorRole = moderatorRole;
        this._superAdminRole = superAdminRole;

        // bind method to this
        this.everyone = this.everyone.bind(this);
        this.member = this.member.bind(this);
        this.admin = this.admin.bind(this);
        this.superAdmin = this.superAdmin.bind(this);
    }

    // public
    everyone(req, res, next) {
        next();
    }

    // can user access member's part ?
    member(req, res, next) {
       
         if( req.session.connected && req.session.user.roleId >= this._defaultRole) {
             next();
         }
         else {
             res.redirect('/unauthorized');
         }
    }

    // can user access admin ?
    admin(req, res, next) {
        
        if( req.session.connected && req.session.user.roleId >= this._moderatorRole) {
            next();
        }
        else {
            res.redirect('/unauthorized');
        }
    }

    // can user access super admin ?
    superAdmin(req, res, next) {

        if( req.session.connected && req.session.user.roleId >= this.__superAdminRole) {
            next();
        }
        else {
            res.redirect('/unauthorized');
        }
    }

}

module.exports = AccessGranted;