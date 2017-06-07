const mongoose = require( 'mongoose');
const encrypt = require( 'bcrypt');
const winston = require('winston');
const jwt = require('jsonwebtoken');
const _ = require( 'underscore');
const UserModel = require( './../models/UserModel');

mongoose.Promise = global.Promise;

class LoginCtrl {
    get(req, res){
        let msg = "";
        
        if (!_.isEmpty(req.params.msg)) {
            msg = req.params.msg;
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
                        
                        /*
                        //save session
                        req.session.connected = true;
                        req.session.user = user;
                        */

                        const data = {
                            id : user._id,
                            pseudo : user.pseudo,
                            roleId: user.roleId
                        };

                        const token = jwt.sign( data, 'secret');
                        
                        // save token as header
                        res.cookie('token', token);
                        
                        res.render('indexAuthenticated.twig', {
                            pseudo: user.pseudo,
                        });
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