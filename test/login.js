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
const credentialsToTest = require('./credentials-to-test');

// Test login
describe('Login', () => {

    // Valid credentials
    it("Accepts correct credentials", () => {
        
        let request = chai.request(server);

        return request.post('/login')
        .send(credentialsToTest.correct)
        
        // check for valid url
        .then( res => {
            res.should.have.status(200);
        });
    });

    // invalid credentials
    credentialsToTest.incorrects.forEach( credentials => {
        it(` ${credentials.name}`, () => {
            let request = chai.request(server);

            return request.post('/login')
            .send(credentials.data)
            
            // check for valid url : not good
            .then( res => {
                res.should.have.status(200);
            })
            
            // check for invalid url : good
            .catch( res => {
                res.should.have.status(400);
            });
        });
    });
});
