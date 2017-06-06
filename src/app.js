/*
 IMPORT PACKAGES
 */
const mongoose = require( 'mongoose');
const winston = require('winston');

// conf files
let CONF;
if(process.env.NODE_ENV === 'production'){
    CONF = require( './../config/config_prod');
} else {
    CONF = require( './../config/config_dev');
}

const Server = require( './Server');


const connect = (username, password, host, port, db) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${db}`, err => {
            if(err){reject(err); return}
            resolve(true);
        })
    })
};

connect(CONF.db.username, CONF.db.password, CONF.db.host, CONF.db.port, CONF.db.base)
    .then( () => {
        winston.info(`### Connected to Mongo DB on ${CONF.db.host}:${CONF.db.port}/${CONF.db.base} ###`);
        const server = new Server(CONF);
        server.run();
    })
    .catch(e => winston.info(e));

