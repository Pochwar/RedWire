/*
 IMPORT PACKAGES
 */
const mongoose = require('mongoose');
const winston = require('winston');
//use .env file
require('dotenv').config();

// conf files
const CONF = require('./../config/config');

//server
const Server = require('./Server');
const server = new Server(CONF);

/**
 * Connect to MongoDB and run server
 * @function
 * 
 * @param {string} username - DB user
 * @param {string} password - DB user password
 * @param {string} host - DB adress
 * @param {number} port - DB port
 * @param {string} db - DB name
 * 
 * @return {Promise} - Success: call the run() method of Server Object
 */
const connect = (username, password, host, port, db) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${db}`, err => {
            if (err) { reject(err); return }
            resolve(true);
        })
    })
};

connect(CONF.db.username, CONF.db.password, CONF.db.host, CONF.db.port, CONF.db.base)
    .then(() => {
        winston.info(`### Connected to Mongo DB on ${CONF.db.host}:${CONF.db.port}/${CONF.db.base} ###`);
        server.run();
    })
    .catch(e => winston.info(e));

module.exports = server._app;