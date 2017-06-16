//use .env file
require('dotenv').config({path: 'test.env'});

// require chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();
chai.use( chaiHttp );

// conf file
const conf = require('../config/config');

// dataset for testing
const registerData = require('./addSerie-dataset.js');

// Test Serie
describe('Serie : ' + registerData.route.name, () => {

    // all datas
    registerData.dataset.forEach( dataset => {
        it(`${dataset.name} => ${registerData.route.verb} ${registerData.route.path}`, () => {
            
            // start request
            let request = chai.request(server);

            // http verb
            if( registerData.route.verb == 'get') {
                request = request.get(registerData.route.path);
            }
            else if ( registerData.route.verb == 'post') {
                request = request.post(registerData.route.path);
            }
            else {
                throw new Error('Register js - Invalid verb paramter');
            }

            // send data (works with get ?)
            return request.send(dataset.data)

            // check for valid url
            .then( res => {
                res.should.have.status(dataset.status);
            })
            
            // check for invalid url
            .catch( res => {

                // rethrow assertion error (we only catch bad url)
                if( res.message && res.showDiff && res.actual) {
                    throw res;
                }
                
                res.should.have.status(dataset.status);
            });
            
        });
    });
});