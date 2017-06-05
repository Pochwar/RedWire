// Middleware to restric access 

class AccessGranted  {

    // can user access site ?
    static toSite(req, res, next) {
       
         if( req.session.connected) {
             next();
         }
         else {
             res.redirect('/unauthorized');
         }
    }

    // can user access admin ?
    static toAdmin(req, res, next) {
        
        if( req.session.user.roleId >= 3) {
            next();
        }
        else {
            res.redirect('/unauthorized');
        }
    }

    // can user access super admin ?
    static toSuperAdmin(req, res, next) {

        if( req.session.user.roleId >= 4) {
            next();
        }
        else {
            res.redirect('/unauthorized');
        }
    }
    
}

module.exports = AccessGranted;