/*
 PACKAGES
 */
const FakeUser = require('./FakeUser');
const UserModel = require ('./../models/UserModel')
const mongoose = require('mongoose');
const Promise = require('bluebird');
const winston = require('winston');
// conf files
let CONF;
if(process.env.NODE_ENV === 'prod'){
    CONF = require( './../../config/config_prod');
} else {
    CONF = require( './../../config/config_dev');
}

/*
 BLUEBIRD PROMISES
 */
const promiseWhile = (condition, action) => {
    const resolver = Promise.defer();
    const loop = () => {
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
const connect = (username, password, host, port, db) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${db}`, err => {
            if(err){reject(err); return}
            resolve(true);
        })
    })
};

/*
 CREATE FAKE USERS
 */
connect(CONF.db.username, CONF.db.password, CONF.db.host, CONF.db.port, CONF.db.base)
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
                                    fakeUser.createdAt,
                                    hashPass,
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
