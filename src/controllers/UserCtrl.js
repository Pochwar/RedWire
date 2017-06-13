const mongoose = require( 'mongoose');
const encrypt = require( 'bcrypt');
const winston = require( 'winston');
const uniqid = require('uniqid');
const path = require('path');
const _ = require('underscore');
const UserModel = require( './../models/UserModel');

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
            msg: msg
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

        //change password
        if(dataToChange === "password"){
            //check passwords
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
        }

        //change avatar
        else if(dataToChange === "avatar"){
            //check avatar
            let filename = "";
            const avatar = req.files.avatar;
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
        }

        //change anything else
        else {
            winston.info(`${dataToChange} : ${req.body.value}`)
            user.updateData(userId, dataToChange, req.body.value)
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



    }
}

module.exports = UserCtrl;