//use .env file
require('dotenv').config({path: 'test.env'});

// conf files
const CONF = require('./../config/config');

const chai = require('chai');
const server = require('../src/app');
const expect = chai.expect;

const TmdbService = require('../src/services/TmdbService');

describe('TmdbService', () => {

    tmdbService = new TmdbService( CONF.API.tmdb.token );

    describe('#searchByTitle', () => {
        
        it('find series by title', done => {

            tmdbService.searchByTitle('games ', 'fr')
            .then( series => {
                expect( series.length).to.exist;
                
                done();
            });
            
        });
    });

    describe('#searchByActors', () => {
         it('find series by actors', done => {

            tmdbService.searchByActors('eva ', 'fr')
            .then( series => {
                expect( series.length).to.exist;
                done();
            });
            
        });
    });
    
    describe('#getSerie', () => {
         
         it('find series by id', done => {

            tmdbService.getSerie(30, 'fr')
            .then( series => {
                expect( Object.keys(series) ).to.exist;
                done();
            });
            
        });
    });

    /*
    describe('#getSeason', () => {
         
         it('find season by id', done => {
            tmdbService.getSeason(30, 8,'fr')
            .then( season => {
                console.log(season);
                expect( Object.keys(season) ).to.exist;
                done();
            });
            
        });
    });
    */
    
});
