const encrypt = require( 'bcrypt');
const winston = require( 'winston');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const UserModel = require( './../models/UserModel');
const mongoose = require('mongoose');

class UserCtrl {
    constructor(conf){
        this._conf = conf;
    }

    getWall(req, res) {
        res.render('wall.twig');
    }

    getUserInfo(req, res) {
        let i18nMsg = ""
        if (!_.isEmpty(req.query.msg)) {
            const msg = req.query.msg;
            winston.info(msg)
            if (this._conf.site.authErrMsg.userMod.includes(msg)) {
                i18nMsg = res.__(msg)
            }
        }
        res.render('user.twig', {
            msg: i18nMsg,
        });
    }

    putUserEpisodes(req, res) {
        const episodeId = req.body.episodeId;
        const userId = res.locals.user._id;
        const remove = req.body.remove;

        const user = new UserModel();

        user.viewedEpisode(userId, episodeId, remove)
            .then( () => {
                res.json({
                    msg: res.__("ADDED_EPISODE"),
                })
            })
            .catch( err => {
                winston.info(err);
                res.status(500).json({
                        status: 500,
                        error: err,
                    })
            })
    }

    putUserSeries(req, res) {
        const serieId = req.body.serieId;
        const userId = res.locals.user._id;
        const remove = req.body.remove;

        const user = new UserModel();

        user.followedSerie(userId, serieId, remove)
            .then( () => {
                res.json({
                    msg: res.__("ADDED_EPISODE"),
                })
            })
            .catch( err => {
                winston.info(err);
                res.status(500).json({
                        status: 500,
                        error: err,
                    })
            })
    }

    putUserInfo(req, res) {
        const userId = req.body.userId;
        const dataToChange = req.body.change;

        const user = new UserModel();

        //delete avatar function
        const deleteAvatar = (fileName) => {
            //update user info in db
            return new Promise((resolve, reject) => {
                user.updateData(userId, "avatar", "")
                    .then( () => {
                        //delete file
                        return fs.unlink(path.join(this._conf.site.default.avatarPath, fileName));
                    })
                    .then( () => {
                        resolve();
                    })
                    .catch( (err) => {
                        winston.info(err);
                        reject();
                    })
                ;
            })
        }

        //no change
        if(!dataToChange){
            res.redirect('/user?msg=UIM_noChange');
            return;
        }

        //User Information Verification
        const UIV = req.app.get('UIV');

        //change password
        if(dataToChange === "password"){
            //check passwords are same
            if (req.body.password !== req.body.passwordConf) {
                res.redirect('/user?msg=UIM_passNoMatch');
                return;
            }

            //check password is alphanumeric
            let checkPassAlphaNum = UIV.checkAlphaNumOnly(req.body.password);
            if (!checkPassAlphaNum) {
                res.redirect('/user?msg=UIM_passAlphaNumError');
                return;
            }

            const saltRounds = 10;
            encrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if(err) {
                    res.redirect('/user?msg=UIM_passError');
                    return;
                } else {
                    winston.info(userId)
                    user.updateData(userId, dataToChange, hash)
                        .then(document => {
                            res.redirect('/user?msg=UIM_passChangeOk');
                            return;
                        })
                        .catch(err =>{
                            res.redirect('/user?msg=UIM_dbError');
                            return;
                        })
                    ;
                }
            })
        }

        //change avatar
        else if(dataToChange === "avatar"){

            //if user has already an avatar
            if (req.body.fileName != ""){
                //delete previous avatar
                deleteAvatar(req.body.fileName)
                    .then( () => {
                        //set new avatar
                        user.updateData(userId, dataToChange, req.file.filename)
                            .then( () => {
                                res.redirect('/user?msg=UIM_avatarChangeOk');
                                return;
                            })
                            .catch( () => {
                                res.redirect('/user?msg=UIM_dbError');
                                return;
                            })
                        ;
                    })
                    .catch( () => {
                        res.redirect('/user?msg=UIM_avatarDeletetionError');
                        return;
                    })
                ;
            } else {
                //set new avatar
                user.updateData(userId, dataToChange, req.file.filename)
                    .then( () => {
                        res.redirect('/user?msg=UIM_avatarChangeOk');
                        return;
                    })
                    .catch( () => {
                        res.redirect('/user?msg=UIM_dbError');
                        return;
                    })
                ;
            }
        }

        //delete avatar
        else if(dataToChange === "deleteAvatar"){
            deleteAvatar(req.body.fileName)
                .then( () => {
                    res.redirect('/user?msg=UIM_avatarDeleted');
                    return;
                })
                .catch( () => {
                    res.redirect('/user?msg=UIM_avatarDeletetionError');
                    return;
                })
            ;
        }

        //change date
        else if(dataToChange === "birthday"){
            //check birthday
            let birthdayFormatOk = UIV.checkDateFormat(req.body.birthday);
            let birthdayAgeOk = UIV.checkAge(req.body.birthday)
            if(!birthdayFormatOk || !birthdayAgeOk){
                res.redirect('/user?msg=UIM_birthdayError');
                return;
            }

            const birthdayArray = req.body.birthday.split("/");
            const birthday = new Date(birthdayArray[2],(birthdayArray[1]-1), birthdayArray[0]);
            
            user.updateData(userId, dataToChange, birthday)
                .then(document => {
                    winston.info("ok")
                    res.redirect('/user?msg=UIM_birthdayChangeOk');
                    return;
                })
                .catch(err => {
                    winston.info(`error : ${err}`)
                    res.redirect('/user?msg=UIM_dbError');
                    return;
                })
            ;
        }

        //change lang
        else if(dataToChange === "langId"){
            //check birthday
            let langIdOk = UIV.checkLangId(req.body.langId);
            if(!langIdOk){
                res.redirect('/user?msg=UIM_langIdError');
                return;
            }

            user.updateData(userId, dataToChange, req.body.langId)
                .then(document => {
                    winston.info("ok")
                    res.redirect('/user?msg=UIM_langIdChangeOk');
                    return;
                })
                .catch(err => {
                    winston.info(`error : ${err}`)
                    res.redirect('/user?msg=UIM_dbError');
                    return;
                })
            ;
        }

        //change mail
        else if(dataToChange === "mail"){
            //check birthday
            let mailOk = UIV.checkMail(req.body.mail);
            if(!mailOk){
                res.redirect('/user?msg=UIM_mailError');
                return;
            }

            user.updateData(userId, dataToChange, req.body.mail)
                .then(document => {
                    winston.info("ok")
                    res.redirect('/user?msg=UIM_mailChangeOk');
                    return;
                })
                .catch(err => {
                    winston.info(`error : ${err}`)
                    res.redirect('/user?msg=UIM_dbError');
                    return;
                })
            ;
        }

        //change anything else
        else {
            //check password is alphanumeric
            let checkAlphaNum = UIV.checkAlphaNumOnly(req.body.value);
            if (!checkAlphaNum) {
                res.redirect('/user?msg=UIM_'+dataToChange+'AlphaNumError');
                return;
            }

            user.updateData(userId, dataToChange, req.body.value)
                .then( () => {
                    winston.info("ok")
                    res.redirect('/user?msg=UIM_'+dataToChange+'ChangeOk');
                    return;
                })
                .catch( err => {
                    winston.info(`error : ${err}`)
                    res.redirect('/user?msg=UIM_dbError');
                    return;
                })
            ;
        }
    }
}

module.exports = UserCtrl;
