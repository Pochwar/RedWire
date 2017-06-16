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
        
        it('find series by title', () => {

            return tmdbService.searchByTitle('games ', 'fr')
            .then( series => {
                expect( series.length).to.exist;
                
            });
            
        });
    });

    describe('#searchByActors', () => {
         it('find series by actors', () => {

            return tmdbService.searchByActors('eva ', 'fr')
            .then( series => {
                expect( series.length).to.exist;
            });
            
        });
    });
    
    describe('#getSerie', () => {
         
         it('find series by id', () => {

            return tmdbService.getSerie(30, 'fr')
            .then( series => {
                expect( Object.keys(series) ).to.exist;
            });
            
        });
    });
    
});
