const mongoose = require('mongoose');
const encrypt = require('bcrypt');
const winston = require('winston');
const _ = require( 'underscore');
const UserModel = require( './../models/UserModel');

mongoose.Promise = global.Promise;

class LoginCtrl {
    get(req, res) {
        let msg = "";

        if (!_.isEmpty(req.query.msg)) {
            msg = req.query.msg;
        }
        res.render('login.twig', {
            msg: msg,
        });
    }

    post(req, res) {
        //check fields
        if (
            _.isEmpty(req.body.mail) ||
            _.isEmpty(req.body.password)
        ) {
            res.json({ msg: "emptyError" });
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.json({ msg: "dbError" });
        }


        const user = new UserModel();
        user.findByMail(req.body.mail)
            .then(user => {
                winston.info(`### find user : ${user.pseudo} ###`);
                //password verification
                encrypt.compare(req.body.password, user.pass, (err, resp) => {
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
                        
                        res.render('indexAuthenticated.twig');
                    } else {
                        winston.info(`wrong pass`);
                        res.redirect('/login?msg=loginError');
                    }
                });
            })
            .catch(e => {
                winston.info(`### no user found : ${e}`);
                res.json({ msg: "loginError" });
            })
        ;
    }

}

module.exports = LoginCtrl;