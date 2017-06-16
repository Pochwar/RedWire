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
            res.status(400).render('registration.twig', {
                status: 400,
                error: res.__('ERROR_EMPTY'),
            });
            return;
        }

        //check passwords
        if (req.body.password !== req.body.passwordConf) {
            res.status(400).render('registration.twig', {
                status:400,
                error: res.__('ERROR_PASS'),
            });
            return;
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.status(400).render('registration.twig', {
                status: 400,
                error: res.__('ERROR_SERVER'),
            });
            return;
        }


        //User Information Verification
        const UIV = req.app.get('UIV');

        //fields that need to be alphanumeric only
        const alphaNumFields = [req.body.firstname, req.body.lastname, req.body.pseudo, req.body.password];
        let alphaNumFieldsOk = true;
        alphaNumFields.forEach(field => {
            let check = UIV.checkAlphaNumOnly(field);
            if (!check) alphaNumFieldsOk = false;
        })

        if (!alphaNumFieldsOk) {
            res.status(400).render('registration.twig', {
                status: 400,
                error: res.__('ALPHANUM_ONLY'),
            });
            return;
        }

        //check birthday
        let birthdayFormatOk = UIV.checkDateFormat(req.body.birthday);
        let birthdayAgeOk = UIV.checkAge(req.body.birthday)
        if (!birthdayFormatOk || !birthdayAgeOk) {
            res.status(400).res.render('registration.twig', {
                status: 400,
                error: res.__('BIRTHDAY_INVALID'),
            });
            return;
        }

        //check mail
        let mailOk = UIV.checkMail(req.body.mail);
        if (!mailOk) {
            res.status(400).render('registration.twig', {
                status: 400,
                error: res.__('MAIL_INVALID'),
            });
            return;
        }

        //check langId
        let langIdOk = UIV.checkLangId(req.body.langId);
        if (!langIdOk) {
            res.status(400).render('registration.twig', {
                status: 400,
                error: res.__('LANGID_INVALID'),
            });
            return;
        }

        //CREATE NEW USER
        const user = new UserModel();

        //set date of the day
        const createdAt = new Date();

        //set default ban status and role id
        const ban = this._conf.site.default.ban;
        const roleId = this._conf.site.default.role;


        //format birthday
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
                    const mailService = req.app.get('mailService');
                    const host = req.get('host');
                    const to = req.body.mail;
                    return mailService.send(host, to);
                })
                .then(function() {
                    res.render('mailSent.twig');
                })
                .catch(err => {
                    winston.info(`RegistrationCtrl - post - error :  ${err.message}`);
                    if (err.message.match(/duplicate/i)) {
                        if (err.message.match(/pseudo/i)) {
                            res.status(500).render('registration.twig', {
                                status: 500,
                                error: res.__('ERROR_PSEUDO'),
                            });
                            return;
                        } else if (err.message.match(/mail/i)) {
                            res.status(500).render('registration.twig', {
                                status: 500,
                                error: res.__('ERROR_MAIL'),
                            });
                            return;
                        } else {
                            res.status(500).render('registration.twig', {
                                status: 500,
                                error: res.__('ERROR_SERVER'),
                            });
                            return;
                        }
                    }
                    res.status(500).render('registration.twig', {
                        status: 500,
                        error: res.__('ERROR_SERVER'),
                    });
                });
        })

    }

    verify(req, res) {
        const mail = req.query.mail;
        const id = req.query.id;
        const mailService = req.app.get('mailService');
        mailService.verify(mail, id)
            .then(function() {
                res.render('mailConfirmed.twig');
            })
            .catch(function(error) {
                winston.info(error);
                res.status(500).render('error.twig');
            })
    }

}

module.exports = RegistrationCtrl;