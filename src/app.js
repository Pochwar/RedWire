/*
 IMPORT PACKAGES
 */
import CONF from './../config/config';
import Server from './Server';
import mongoose from 'mongoose';

const connect = (host, port, db) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb://${host}:${port}/${db}`, err => {
            if(err){reject(err); return}
            resolve(true);
        })
    })
};

connect(CONF.db.host, CONF.db.port, CONF.db.base)
    .then(response => {
        console.log(`### Connected to Mongo DB on ${CONF.db.host}:${CONF.db.port}/${CONF.db.base} ###`);
        const server = new Server();
        server.run(CONF.server.port);
    })
    .catch(e => console.log(e))
;

