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
                            .then( () => {
                                res.redirect('/user?msg='+dataToChange);
                            })
                            .catch( () => {
                                res.redirect('/user?msg=avatarError');
                            })
                        ;
                    }
                });
        }

        //change date
        else if(dataToChange === "birthday"){
            var dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
            if(!req.body.birthday.match(dateRegex)){
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
            winston.info(`${dataToChange} : ${req.body.value}`)
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

    postUserFollow(req, res) {
        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.json({ locales: res.locals.user._id });
            };
            return;
        }    
    
}

module.exports = UserCtrl;
