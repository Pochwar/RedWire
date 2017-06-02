const mongoose = require( 'mongoose');
const encrypt = require( 'bcrypt');
const winston = require('winston');
const _ = require( 'underscore');
const UserModel = require( './../models/UserModel');

mongoose.Promise = global.Promise;

class LoginCtrl {
    get(req, res){
        let msg = "";
        if (!_.isEmpty(req.param("msg"))) {
            msg = req.param("msg");
        }
        res.render('login.twig', {
            msg: msg,
        });
    }

    post(req, res){
        //check fields
        if (
            _.isEmpty(req.body.mail) ||
            _.isEmpty(req.body.pass)
        ) {
            res.redirect('/login?msg=emptyError');
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.redirect('/register?msg=dbError');
        }


        const user = new UserModel();
        user.findByMail(req.body.mail)
            .then(user => {
                winston.info(`### find user : ${user.pseudo} ###`);
                //password verification
                encrypt.compare(req.body.pass, user.pass, (err, resp) => {
                    if (resp) {
                        winston.info(`user connected`);
                        //save session
                        req.session.connected = true;
                        req.session.user = user;
                        res.redirect('/');
                    } else {
                        winston.info(`wrong pass`);
                        res.redirect('/login?msg=passError');
                    }
                });
            })
            .catch(e => {
                winston.info(`### no user found : ${e}`);
                res.redirect('/login?msg=userError');
            })
        ;
    }

}

module.exports = LoginCtrl;