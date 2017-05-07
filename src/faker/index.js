/*
PACKAGES
 */
import faker from 'faker';
import encrypt from 'bcrypt';
import mongoose from 'mongoose';
import loadJsonFile  from 'load-json-file';
import path from 'path';
import UserModel from './../models/users';
import Promise from 'bluebird';


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

        connect(config.db.ip, config.db.port, config.db.base)
            .then(response => {
                console.log(`==Connected to Mongo DB on ${config.db.ip}:${config.db.port}/${config.db.base}==`);

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
                            //user lang : random between "fr" and "en"
                            let locale;
                            let randLangId = Math.round(Math.random());
                            switch (randLangId){
                                case 0:
                                    locale = "fr";
                                    break;

                                case 1:
                                    locale = "en";
                                    break;
                            }

                            //user role : random between 0 and 5
                            let randRoleId =Math.floor(Math.random()*5);

                            //set locale
                            faker.locale = locale;

                            //generate fake user
                            let firstname = faker.name.firstName();
                            let lastname = faker.name.lastName();
                            let pseudo = faker.internet.userName(firstname, lastname);
                            let bDay = faker.date.past(50, new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)"));
                            let mail = faker.internet.email(firstname, lastname);
                            let inscrDay = faker.date.recent();
                            let pass = faker.internet.password();
                            let avatar = faker.internet.avatar();
                            let ban = faker.random.boolean();
                            let lanId = randLangId;
                            let roleId = randRoleId;


                            // password encrypt
                            let passwordEncrypt = new Promise((resolve, reject) => {
                                encrypt.hash(pass, 10, (err, hash) => {
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
                                    user.save(firstname, lastname, pseudo, bDay, mail, inscrDay, hashPass, avatar, ban, lanId, roleId);
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






