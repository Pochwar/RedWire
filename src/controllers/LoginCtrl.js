const mongoose = require('mongoose');
const encrypt = require('bcrypt');
const winston = require('winston');
const _ = require( 'underscore');
const UserModel = require( './../models/UserModel');

mongoose.Promise = global.Promise;

class LoginCtrl {
    
    post(req, res) {
        
        //check fields
        if (
            _.isEmpty(req.body.mail) ||
            _.isEmpty(req.body.password)
        ) {
            res.status(400).json({ msg: "emptyError", });
            return;
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.status(500).json({ msg: "dbError", });
            return;

        }


        const user = new UserModel();
        user.findByMail(req.body.mail)
            .then(user => {
                winston.info(`### find user : ${user.pseudo} ###`);
                //password verification
                encrypt.compare(req.body.password, user.password, (err, resp) => {
                    if (resp) {
                        winston.info(`user connected`);

                        const data = {
                            id: user._id,
                        };

                        const tokenService = req.app.get('tokenService');

                        const token = tokenService.create(data);

                        // save token as cookie
                        const conf = req.app.get('conf');
                        res.cookie(conf.site.cookies.tokenName, token, {
                            maxAge: conf.site.cookies.maxAge,
                            httpOnly: true,
                        });
                        
                        // get user lang
                        const langService = req.app.get('langService');
                        const lang = langService.getUserLang( user);

                        // set locale lang
                        langService.setLocale(res, lang);
                        
                        // send lang cookie
                        langService.sendCookie(res,lang);

                        // save use as local user
                        res.locals.user = user;
                        
                        res.status(200).json({ msg: "loginOk", });
                    } else {
                        winston.info(`wrong pass`);
                        res.status(400).json({ msg: "loginError", });
                    }
                });
            })
            .catch(e => {
                winston.info(`### no user found : ${e}`);
                res.status(400).json({ msg: "loginError", });
            })
        
    }

}

module.exports = LoginCtrl;