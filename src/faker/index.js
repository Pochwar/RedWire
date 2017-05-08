/*
PACKAGES
 */
import FakeUser from './FakeUser';
import encrypt from 'bcrypt';
import mongoose from 'mongoose';
import loadJsonFile  from 'load-json-file';
import path from 'path';
import UserModel from './../models/users';
import Promise from 'bluebird';
import orm from 'orm';

/*
GET CONFIG
 */
const file = path.join(__dirname, '../../config/config.json');

loadJsonFile(file)
    .then(config => {

        /*
        CONNECT TO DB
         */
        const connect = (ip, port, db) => {
            return new Promise((resolve, reject) => {
                mongoose.connect(`mongodb://${ip}:${port}/${db}`, err => {
                    if(err){reject(err); return}
                    resolve(true);
                })
            })
        }

        connect(config.db.mongo.ip, config.db.mongo.port, config.db.mongo.base)
            .then(response => {
                console.log(`==Connected to Mongo DB on ${config.db.mongo.ip}:${config.db.mongo.port}/${config.db.mongo.base}==`);

                /*
                CREATE FAKE USERS
                */

                // create user model
                const user = new UserModel();

                //BlueBird Promise
                let promiseWhile = function(condition, action) {
                    let resolver = Promise.defer();
                    let loop = function() {
                        if (!condition()) return resolver.resolve();
                        return Promise.cast(action())
                            .then(loop)
                            .catch(resolver.reject);
                    };
                    process.nextTick(loop);
                    return resolver.promise;
                };

                //Loop to generate fake users and save them to DB
                let i = 1;
                promiseWhile(
                    //condition
                    () => {
                        return i <= config.param.quantity
                    },
                    //action
                    () => {
                        return new Promise((resolve, reject) => {

                            const fakeUser = new FakeUser();

                            // password encrypt
                            let passwordEncrypt = new Promise((resolve, reject) => {
                                encrypt.hash(fakeUser.pass, 10, (err, hash) => {
                                    let hashPass = hash;
                                    resolve(hashPass);
                                    let error = {
                                        message : `error in password encryption : ${err}`,
                                    };
                                    reject(error);
                                });
                            });

                            passwordEncrypt
                                .then(hashPass => {
                                    //save user
                                    user.save(fakeUser.firstname, fakeUser.lastname, fakeUser.pseudo, fakeUser.bDay, fakeUser.mail, fakeUser.inscrDay, hashPass, fakeUser.avatar, fakeUser.ban, fakeUser.lanId, fakeUser.roleId);
                                })
                            ;

                            i++;
                            resolve();
                        });
                    }
                )

            })
            .catch(e => console.log(e))
        ;
    })
    .catch(e => console.log(e))
;
