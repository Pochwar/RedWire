/*
 PACKAGES
 */
const FakeUser = require('./FakeUser');
const UserModel = require ('./../models/UserModel')
const path = require('path');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const winston = require('winston');
const CONF = require('./../../config/config');

/*
 BLUEBIRD PROMISES
 */
let promiseWhile = (condition, action) => {
    let resolver = Promise.defer();
    let loop = () => {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };
    process.nextTick(loop);
    return resolver.promise;
};


/*
MONGO CONNECTION
 */
const connect = (host, port, db) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb://${host}:${port}/${db}`, err => {
            if(err){reject(err); return}
            resolve(true);
        })
    })
};

/*
 CREATE FAKE USERS
 */
connect(CONF.db.host, CONF.db.port, CONF.db.base)
    .then( () => {
        winston.info(`### Connected to Mongo DB on ${CONF.db.host}:${CONF.db.port}/${CONF.db.base} ###`);

        //user model
        const user = new UserModel();

        let i = 1;
        promiseWhile(
            //condition
            () => {
                return i <= CONF.faker.quantity;
            },
            //action
            () => {
                return new Promise((resolve, reject) => {
                    //create fakeUser
                    const fakeUser = new FakeUser();
                    //hash password
                    fakeUser.passwordEncrypt
                        .then(hashPass => {
                            //save user
                            user.registerInDb(
                                    fakeUser.firstname,
                                    fakeUser.lastname,
                                    fakeUser.pseudo,
                                    fakeUser.bDay,
                                    fakeUser.mail,
                                    fakeUser.inscrDay,
                                    hashPass,
                                    fakeUser.avatar,
                                    fakeUser.ban,
                                    fakeUser.lanId,
                                    fakeUser.roleId
                            )
                                .then(user => winston.info(`User ${user.pseudo} created !!`))
                                .catch(e => winston.info(e));
                        })
                    ;
                    i++;
                    resolve();
                }); //end of user create Promise
            } //end of promiseWhile action
        ); //end of promiseWhile

    })
    .catch(e => winston.info(e));
