/*
 IMPORT PACKAGES
 */
const mongoose = require( 'mongoose');
const winston = require('winston');

const CONF = require( './../config/config');
const Server = require( './Server');


const connect = (host, port, db) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb://${host}:${port}/${db}`, err => {
            if(err){reject(err); return}
            resolve(true);
        })
    })
};

connect(CONF.db.host, CONF.db.port, CONF.db.base)
    .then( () => {
        winston.info(`### Connected to Mongo DB on ${CONF.db.host}:${CONF.db.port}/${CONF.db.base} ###`);
        const server = new Server();
        server.run(CONF.server.port);
    })
    .catch(e => winston.info(e));

