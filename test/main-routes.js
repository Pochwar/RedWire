//use .env file
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

chai.use( chaiHttp );


describe('Public section', () => {

    const routesExpected= [
        {
            verb: 'get',
            path: '/',
            status: 200
        },
        {
            verb: 'get',
            path: '/lang',
            status: 400
        },
        {
            verb: 'get',
            path: '/lang/fr',
            status: 200
        },
        {
            verb: 'get',
            path: '/lang/en',
            status: 200
        },
        {
            verb: 'get',
            path: '/signup',
            status: 200
        },
        {
            verb: 'post',
            path: '/login',
            status: 200
        },
    ];

    routesExpected.forEach( route => {
         it( route.path, done => {
            chai.request(server)
            .get(route.path)
            .end(function(err, res){
                res.should.have.status(route.status);
            done();
        });
    });
    })
   
});

describe('Member section', () => {

    const routesExpected= [
        {
            verb: 'get',
            path: '/site',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/series',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/comments',
            status: 404
        },
        {
            verb: 'get',
            path: '/site/comments/series',
            status: 400
        },
        {
            verb: 'get',
            path: '/site/comments/series/10',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/comments/series',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/comments/season',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/notes/critic',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/notes/serie',
            status: 200
        },
        {
            verb: 'put',
            path: '/site/series',
            status: 400
        },
        {
            verb: 'put',
            path: '/site/series/2',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/search',
            status: 404
        },
        {
            verb: 'post',
            path: '/site/search/actor',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/search/title',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/series/',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/series/add',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/wall',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/episod',
            status: 404
        },
        {
            verb: 'get',
            path: '/site/episod/5',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/watched/5',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/comments/episod',
            status: 404
        },
        {
            verb: 'post',
            path: '/site/comments/episod/5',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/notes/episod',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/chat',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/logout',
            status: 200
        },
        {
            verb: 'get',
            path: '/site/user',
            status: 200
        },
        {
            verb: 'post',
            path: '/site/notifications',
            status: 200
        },
        {
            verb: 'put',
            path: '/site/user',
            status: 200
        },
        
    ];

    routesExpected.forEach( route => {
         it( route.path, done => {
            chai.request(server)
            .get(route.path)
            .end(function(err, res){
                res.should.have.status(route.status);
            done();
        });
    });
    })
   
});

describe('Admin section', () => {

    const routesExpected= [
       
    ];

    routesExpected.forEach( route => {
         it( route.path, done => {
            chai.request(server)
            .get(route.path)
            .end(function(err, res){
                res.should.have.status(route.status);
            done();
        });
    });
    })
   
});


/*
describe('Member section', () => {

    before( done => {
        chai.request(server)
        .post('/login')
        .field('mail', 'gabriel@mail.com')
        .field('pass', 'gabriel')
        .end( (err, res) => {
            done();
        });
    });

    it('should connect if no right', done => {
       chai.request(server)
       .get('/series')
       .end( (err,res) => {
            res.should.have.status(403);
            done();
       });
    })
   
    after( done => {
        chai.request(server)
        .post('/logout')
        .end( () => {
            done();
        });
    })
});
*/