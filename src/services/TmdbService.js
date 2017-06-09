// service pour l'api tmdb
const TmdbApi = require('tmdbapi');

class TmdbService {

    constructor( apiKey) {
        this._tmdb = new TmdbApi({apiv3: apiKey});
    }

    searchByTitle( title, lang) {
        return new Promise( (resolve, reject) => {
            
            this._tmdb.search.tv({
                query: title,
                language: lang
            })
            .then( response => {

                resolve( response);

                /*
                response.results.forEach(serie => {

                    this._tmdb.tv.credits( {tv_id: serie.id} )
                    .then(actors => {
                        
                        series.actors = [];
                        if(actors !== null) {
                            series.actors = actors;
                        }

                        resolve( series );
                    })
                    .catch(e => reject(e) );
                    
                });
                */
            })
            .catch(e => reject(e) );
        });
    }
}

module.exports = TmdbService;
