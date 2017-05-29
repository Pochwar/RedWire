import mongoose from 'mongoose';
import encrypt from 'bcrypt';
import _ from 'underscore';
import UserModel from './../models/UserModel';

mongoose.Promise = global.Promise;

export default class LoginCtrl {
    get(req, res){
        let msg = "";
        if (!_.isEmpty(req.param("msg"))) {
            msg = req.param("msg");
        }
        res.render('login.twig', {
            msg: msg
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
                console.log(`### find user : ${user.pseudo} ###`)
                //password verification
                encrypt.compare(req.body.pass, user.pass, (err, resp) => {
                    if (resp) {
                        console.log(`user connected`)
                        //save session
                        req.session.connected = true;
                        req.session.user = user;
                        res.redirect('/');
                    } else {
                        console.log(`wrong pass`)
                        res.redirect('/login?msg=passError');
                    }
                });
            })
            .catch(e => {
                console.log(`### no user found : ${e}`)
                res.redirect('/login?msg=userError');
            })
        ;
    }

}
