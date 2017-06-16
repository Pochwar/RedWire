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
const routesToTest = require('./routes-to-test');
const credentialsToTest = require('./credentials-to-test');

// Test all routes when not logged in
describe('URL - not authenticated', () => {

    routesToTest.notLogged.forEach( route => {
        it( `${route.name} => ${route.verb}  ${route.path}`, () => {
            
            let request = chai.request(server);

            if( route.verb == 'get') {
                request = request.get(route.path);
            }
            else if ( route.verb == 'post') {
                request = request.post(route.path);

                route.params.forEach( param => {
                    request = request.field( param.key, param.value);
                });
            }

            return request.end(function(err, res) {
                res.should.have.status(route.status);
            });
            
        });
    })
   
});

// Test all routes when logged in
describe('URL - as Member', () => {
    
    routesToTest.logged.forEach( route => {
        it( `${route.name} => ${route.verb} ${route.path}`, () => {
            
            let agent = chai.request.agent(server);
            
            // login with good credentials
            return agent.post('/login')
            .send( credentialsToTest.correct )
            
            // check cookie & send request
            .then(function (res) {
                res.should.have.cookie( conf.site.cookies.tokenName);
                
                return agent.get(route.path);
            })
            // check server response for valid url
            .then(function (res) {
                res.should.have.status(route.status);
            })
            // check server response for invalid url
            .catch(function (res) {
                res.should.have.status(route.status);
            });
        });
    });
});
