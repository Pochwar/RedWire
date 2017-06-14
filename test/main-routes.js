//use .env file
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

chai.use( chaiHttp );

const lang = ['fr', 'en'];

describe('URL - not authenticated', () => {

    const routesExpected= [
        {
            name: 'root',
            verb: 'get',
            path: '/',
            status: 200
        },
        {
            name: 'home',
            verb: 'get',
            path: '/home',
            status: 403
        },
        {
            name: 'lang - invalid',
            verb: 'get',
            path: '/lang/fzux',
            status: 400
        },
        {
            name: 'lang - fr',
            verb: 'get',
            path: '/lang/fr',
            status: 200
        },
        {
            name: 'lang - en',
            verb: 'get',
            path: '/lang/en',
            status: 200
        },
        {
            name: 'registration',
            verb: 'get',
            path: '/register',
            status: 200
        },
        {
            name: 'post login',   
            verb: 'post',
            path: '/login',
            status: 200,
            params: [
                { key: 'mail', value: 'gabriel@mail.com'},
                { key: 'password', value : 'gabriel' },
            ]
        },
        {
            name: 'show all series',
            verb: 'get',
            path: '/series',
            status: 200
        },
        {
            name: 'show one serie',
            verb: 'get',
            path: '/series/593ffaf0a4829c261e31b03d',
            status: 200
        },
        {
            name: 'search - invalid',
            verb: 'get',
            path: '/search',
            status: 400
        },
        {
            name: 'search by actor - invalid',
            verb: 'get',
            path: '/search/actor',
            status: 400
        },
        {
            name: 'search by title - invalid',
            verb: 'get',
            path: '/search/title',
            status: 400
        },
        {
            name: 'user wall',
            verb: 'get',
            path: '/wall',
            status: 403
        },
        {
            name: 'show chat',
            verb: 'get',
            path: '/chat',
            status: 403
        },
        {
            name: 'logout',
            verb: 'get',
            path: '/logout',
            status: 403
        },
        {
            name: 'show user data',
            verb: 'get',
            path: '/user',
            status: 403
        },
        
    ];

   

   
    routesExpected.forEach( route => {
        it( `${route.name} => ${route.path}`, done => {
            
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

            let agent = chai.request.agent(server);
            agent.get('/lang/en').send().then( () => {
                request.end(function(err, res) {
                    res.should.have.status(route.status);
                    done();
                })
            });
            
        });
    })
   
});