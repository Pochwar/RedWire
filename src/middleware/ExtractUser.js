// extract user from token
const winston = require('winston');
const UserModel = require('../models/UserModel');

class ExtractUser {
    
    // validate token
    static fromCookies(req, res, next) {
       
        // init user
        res.locals.user = {};

        // valid cookie
        const conf = req.app.get('conf');
        if (req.cookies && req.cookies[conf.site.cookies.tokenName]) {
            
            // extract data
            const tokenService = req.app.get('tokenService');
            
            try {
                
                const data = tokenService.extractData( req.cookies[conf.site.cookies.tokenName]);
                            
                UserModel.findById( data.id )
                .then( user => {

                    // delete cookie for invalid user
                    if( !user.pseudo) {

                        res.cookie(conf.site.cookies.tokenName, 'del', {
                            maxAge: 0,
                            httpOnly: true,
                        });

                        user = {};
                    }

                    // save user
                    res.locals.user = user;
                    next();
                })
                .catch( err => {
                    winston.info('info', 'ExtractUser.fromcookies - model extraction: ' + err.message);
                    next();
                });
                
            } catch(err) {
                winston.info('info', 'ExtractUser.fromcookiers - jwt extraction : ' + err);
                next();
            }
        }
        
        // invalid cookies
        else {
            next();
        }
    }
}

module.exports = ExtractUser;