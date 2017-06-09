//use .env file
require('dotenv').config();

// conf files
const CONF = require('./../config/config');

const chai = require('chai');
const server = require('../src/app');
const should = chai.should();

const TmdbService = require('../src/services/TmdbService');

describe('TmdbService', () => {

    describe('#searchSeries', () => {

        tmdbService = new TmdbService( CONF.API.tmdb.token );

        it('find series', done => {

            tmdbService.searchByTitle('games ', 'fr')
            .then( series => {
                console.log(series);
                done();
            });
            
        });
    })
});
