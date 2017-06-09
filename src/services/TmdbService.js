// service pour l'api tmdb
const TmdbApi = require('tmdbapi');

class TmdbService {

    constructor( apiKey) {
        this._tmdb = new TmdbApi({apiv3: apiKey});
        console.log(apiKey);
    }

    searchByTitle( title, lang) {
        return new Promise( (resolve, reject) => {
            
            this._tmdb.search.tv({
                query: title,
                language: lang
            })
            .then( response => {
                resolve( response.results);
            })
            .catch(e => reject(e) );
        });
    }

    searchByActors( name, lang ) {
        return new Promise ( (resolve, reject) => {
            this._tmdb.search.person({
                query: name,
                language: lang,
            })
            .then(response => {
                
                resolve(response.results);
            })
            .catch(e => reject(e));
        });
    }

    getSerie( id, lang ) {
        return new Promise ( (resolve, reject) => {
            this._tmdb.tv.details({
                tv_id: id, 
                language: lang
            })
            .then(response => {
                resolve(response);
            })
            .catch(e => reject(e));
        });
    }

    /*
    getSeason( id, numSeason,lang ) {
        return new Promise ( (resolve, reject) => {
            this._tmdb.tv.season.details({
                tv_id: id, 
                season: numSeason, 
            })
            .then(response => {
                resolve(response);
            })
            .catch(e => reject(e));
        });
    }
    */
}

module.exports = TmdbService;