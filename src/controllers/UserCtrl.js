const encrypt = require( 'bcrypt');
const winston = require( 'winston');
const uniqid = require('uniqid');
const path = require('path');
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
        let msg = "";
        if (!_.isEmpty(req.query.msg)) {
            msg = req.query.msg;
        }
        res.render('user.twig', {
            msg: msg,
        });
    }

    putUserInfo(req, res) {
        const userId = req.body.userId;
        const dataToChange = req.body.change;

        const user = new UserModel();

        //no change
        if(!dataToChange){
            res.redirect('/user?msg=noChange');
        }

        //User Information Verification
        const UIV = req.app.get('UIV');

        //change password
        if(dataToChange === "password"){
            //check passwords are same
            if (req.body.password !== req.body.passwordConf) {
                res.redirect('/user?msg=passError');
            } else {
                const saltRounds = 10;
                encrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if(err) {
                        res.redirect('/user?msg=hashError');
                    } else {
                        winston.info(userId)
                        user.updateData(userId, dataToChange, hash)
                            .then( () => {
                                res.redirect('/user?msg='+dataToChange);
                            })
                            .catch( () => {
                                res.redirect('/user?msg=passError');
                            })
                        ;
                    }
                })
            }

            //check password is alphanumeric
            let checkPassAlphaNum = UIV.checkAlphaNumOnly(req.body.password);
            if (!checkPassAlphaNum) {
                res.redirect('/user?msg=passError');
            }

            const saltRounds = 10;
            encrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if(err) {
                    res.redirect('/user?msg=hashError');
                } else {
                    winston.info(userId)
                    user.updateData(userId, dataToChange, hash)
                        .then(document => {
                            res.redirect('/user?msg='+dataToChange);
                        })
                        .catch(err =>{
                            res.redirect('/user?msg=passError');
                        })
                    ;
                }
            })
        }

        //change avatar
        else if(dataToChange === "avatar"){
            console.dir(req.file);
            res.json({
                avatar : req.file
            })
/*
            //check avatar
            // let avatarOk = UIV.checkAvatar(req.files.avatar);
            // if (!avatarOk){
            //     res.redirect('/user?msg=avatarError');
            // }
            let filename = "";
            //TODO del this
            // const avatar = req.files.avatar;
            const avatar = req.file;
            if (avatar) {
                const ext = avatar.mimetype.replace("image/", "");
                filename = `avatar_${uniqid()}.${ext}`;
            }

            //save avatar
            avatar.mv(path.join(this._conf.site.default.avatarPath, filename), (err) => {
                if (err) {
                    winston.info(err);
                    res.redirect('/user?msg=avatarError');
                } else {
                    winston.info('avatar uploaded');
                    user.updateData(userId, dataToChange, filename)
                        .then(document => {
                            res.redirect('/user?msg='+dataToChange);
                        })
                        .catch(err => {
                            res.redirect('/user?msg=avatarError');
                        })
                    ;
                }
            });
*/

        }

        //change date
        else if(dataToChange === "birthday"){
            //check birthday
            let birthdayOk = UIV.checkDateFormat(req.body.birthday);
            if(!birthdayOk){
                res.redirect('/user?msg=birthdayError');
            }

            const birthdayArray = req.body.birthday.split("/");
            const birthday = new Date(birthdayArray[2],(birthdayArray[1]-1), birthdayArray[0]);
            
            user.updateData(userId, dataToChange, birthday)
                .then(document => {
                    winston.info("ok")
                    res.redirect('/user?msg='+dataToChange);
                })
                .catch(err => {
                    winston.info(`error : ${err}`)
                    res.redirect('/user?msg='+dataToChange+'Error');
                })
            ;
        }

        //change anything else
        else {
            //check password is alphanumeric
            let checkAlphaNum = UIV.checkAlphaNumOnly(req.body.value);
            if (!checkAlphaNum) {
                res.redirect('/user?msg=alphaNumError');
            }

            user.updateData(userId, dataToChange, req.body.value)
                .then( () => {
                    winston.info("ok")
                    res.redirect('/user?msg='+dataToChange);
                })
                .catch( err => {
                    winston.info(`error : ${err}`)
                    res.redirect('/user?msg='+dataToChange+'Error');
                })
            ;
        }
    }  
}

module.exports = UserCtrl;
