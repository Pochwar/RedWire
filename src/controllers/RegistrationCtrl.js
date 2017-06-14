const mongoose = require('mongoose');
const encrypt = require('bcrypt');
const winston = require('winston');
const _ = require('underscore');
const UserModel = require('./../models/UserModel');

mongoose.Promise = global.Promise;

class RegistrationCtrl {

    constructor(conf) {
        this._conf = conf;

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    get(req, res) {
        res.render('registration.twig')
    }

    post(req, res) {
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
            res.render('registration.twig', {
                status: 500,
                error: res.__('ERROR_EMPTY'),
            });
            return;
        }

        //check passwords
        if (req.body.password !== req.body.passwordConf) {
            res.render('registration.twig', {
                status: 500,
                error: res.__('ERROR_PASS'),
            });
            return;
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.render('registration.twig', {
                status: 500,
                error: res.__('ERROR_SERVER'),
            });
            return;
        }

        //CREATE NEW USER
        const user = new UserModel();

        //get date of the day
        // const now = new Date();
        // const day = now.getDate();
        // const month = now.getMonth() + 1;
        // const year = now.getFullYear();
        // const createdAt = `${day}/${month}/${year}`;
        const createdAt = new Date();

        //set default ban status and role id
        const ban = this._conf.site.default.ban;
        const roleId = this._conf.site.default.role;

        //check and format birthday
        var dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        if (!req.body.birthday.match(dateRegex)) {
            res.render('registration.twig', {
                msg: res.__('BIRTHDAY_INVALID'),
            });
            return;
        }
        const birthdayArray = req.body.birthday.split("/");
        const birthday = new Date(birthdayArray[2], (birthdayArray[1] - 1), birthdayArray[0]);

        //hash password
        const saltRounds = 10;
        encrypt.hash(req.body.password, saltRounds, (err, hash) => {
            user.registerInDb(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.pseudo,
                    birthday,
                    req.body.mail,
                    createdAt,
                    hash,
                    ban,
                    req.body.langId,
                    roleId
                )
                .then(object => {
                    winston.info(`### user ${object.pseudo} created ! ###`);
                    res.redirect('/send?to=' + req.body.mail);
                })
                .catch(err => {
                    winston.info(`error :  ${err.message}`);
                    if (err.message.match(/duplicate/i)) {
                        if (err.message.match(/pseudo/i)) {
                            res.render('registration.twig', {
                                status: 500,
                                error: res.__('ERROR_PSEUDO'),
                            });
                            return;
                        } else if (err.message.match(/mail/i)) {
                            res.render('registration.twig', {
                                status: 500,
                                error: res.__('ERROR_MAIL'),
                            });
                            return;
                        } else {
                            res.render('registration.twig', {
                                status: 500,
                                error: res.__('ERROR_SERVER'),
                            });
                            return;
                        }
                    }
                    res.render('registration.twig', {
                        status: 500,
                        error: res.__('ERROR_SERVER'),
                    });
                });
        })
    }

}

module.exports = RegistrationCtrl;