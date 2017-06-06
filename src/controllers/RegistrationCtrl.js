const mongoose = require( 'mongoose');
const encrypt = require( 'bcrypt');
const winston = require('winston');
const _ = require( 'underscore');
const uniqid = require('uniqid');
const UserModel = require( './../models/UserModel');

mongoose.Promise = global.Promise;

class RegistrationCtrl {

    constructor(conf) {
        this._conf = conf;

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    get(req, res){
        let msg = "";
        if (!_.isEmpty(req.param("msg"))) {
            msg = req.param("msg");
        }
        res.render('registration.twig', {
            msg: msg,
        })
    }

    post(req, res){
        //check fields
        if (
            _.isEmpty(req.body.firstname) ||
            _.isEmpty(req.body.lastname) ||
            _.isEmpty(req.body.pseudo) ||
            _.isEmpty(req.body.bDay) ||
            _.isEmpty(req.body.mail) ||
            _.isEmpty(req.body.pass) ||
            _.isEmpty(req.body.passConf) ||
            _.isEmpty(req.body.lanId)
        ) {
            res.redirect('/register?msg=emptyError');
        }

        //check passwords
        if (req.body.pass !== req.body.passConf) {
            res.redirect('/register?msg=passError');
        }

        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.redirect('/register?msg=dbError');
        }

        //check avatar
        let filename = "";
        const avatar = req.files.avatar;
        if (avatar) {
            const ext = avatar.mimetype.replace("image/", "");
            filename = `avatar_${uniqid()}.${ext}`;
        }

        //CREATE NEW USER
        const user = new UserModel();
        //get date of the day
        const now = new Date();
        const createdAt = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        //set default ban status and role id
        const ban = this._conf.site.default.ban;
        const roleId = this._conf.site.default.role;
        //hash password
        const saltRounds = 10;
        encrypt.hash(req.body.pass, saltRounds, (err, hash) => {
            user.registerInDb(
                req.body.firstname,
                req.body.lastname,
                req.body.pseudo,
                req.body.bDay,
                req.body.mail,
                createdAt,
                hash,
                filename,
                ban,
                req.body.lanId,
                roleId
            )
                .then(object => {
                    //save avatar
                    avatar.mv(`upload/avatars/${filename}`, (err) => {
                        if (err) {
                            winston.info(err);
                        } else {
                            winston.info('avatar uploaded');
                        }
                    });
                    winston.info(`### user ${object.pseudo} created ! ###`);
                    res.redirect('/register?msg=ok');
                })
                .catch(err => {
                    winston.info(`error :  ${err.message}`);
                    res.redirect('/register?msg=duplicate');
                })
            ;
        })

    }

}

module.exports = RegistrationCtrl;