const mongoose = require( 'mongoose');
const encrypt = require( 'bcrypt');
const winston = require('winston');
const _ = require( 'underscore');
const UserModel = require( './../models/UserModel');

mongoose.Promise = global.Promise;

class RegistrationCtrl {

    constructor(conf) {
        this._conf = conf;

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    get(req, res){
        res.render('registration.twig')
    }

    post(req, res){
        //check fields
        if (
            _.isEmpty(req.body.firstname) ||
            _.isEmpty(req.body.lastname) ||
            _.isEmpty(req.body.pseudo) ||
            _.isEmpty(req.body.birthday) ||
            _.isEmpty(req.body.mail) ||
            _.isEmpty(req.body.password) ||
            _.isEmpty(req.body.passwordConf) ||
            _.isEmpty(req.body.langId)
        ) {
            res.render('registration.twig',{
                msg: "emptyError",
            });
        }

        //check passwords
        if (req.body.password !== req.body.passwordConf) {
            res.render('registration.twig',{
                msg: "passError",
            });
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.render('registration.twig',{
                msg: "dbError",
            });
        }

        //CREATE NEW USER
        const user = new UserModel();
        //get date of the day
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth()+1;
        const year = now.getFullYear();
        const createdAt = `${day}/${month}/${year}`;
        //set default ban status and role id
        const ban = this._conf.site.default.ban;
        const roleId = this._conf.site.default.role;
        //hash password
        const saltRounds = 10;
        encrypt.hash(req.body.password, saltRounds, (err, hash) => {
            user.registerInDb(
                req.body.firstname,
                req.body.lastname,
                req.body.pseudo,
                req.body.birthday,
                req.body.mail,
                createdAt,
                hash,
                ban,
                req.body.langId,
                roleId
            )
                .then(object => {
                    winston.info(`### user ${object.pseudo} created ! ###`);
                    res.render('registration.twig',{
                        msg: "ok",
                    });
                })
                .catch(err => {
                    winston.info(`error :  ${err.message}`);
                    if(err.message.match(/duplicate/i)){
                        if(err.message.match(/pseudo/i)){
                            res.render('registration.twig',{
                                msg: "duplicatePseudo",
                            });
                        }
                        else if(err.message.match(/mail/i)){
                            res.render('registration.twig',{
                                msg: "duplicateMail",
                            });
                        }
                        else {
                            res.render('registration.twig',{
                                msg: "dbError",
                            });
                        }
                    }
                    res.render('registration.twig',{
                        msg: "dbError",
                    });
                })
            ;
        })

    }

}

module.exports = RegistrationCtrl;