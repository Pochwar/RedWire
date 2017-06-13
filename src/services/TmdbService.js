// service pour l'api tmdb
const TmdbApi = require('tmdbapi');

class TmdbService {

    constructor( apiKey) {
        this._tmdb = new TmdbApi({apiv3: apiKey});

        this.searchByTitle = this.searchByTitle.bind(this);
        this.searchByActors = this.searchByActors.bind(this);
        this.getSerie = this.getSerie.bind(this);
        this.formatSerie = this.formatSerie.bind(this);
        this.formatActor = this.formatActor.bind(this);
    }

    searchByTitle( title, lang) {
        
        return new Promise( (resolve, reject) => {
            
            this._tmdb.search.tv({
                query: title,
                language: lang
            })
            .then( response => {
                const series = response.results.map( serie => this.formatSerie(serie, lang));
                resolve( series);
            })
            .catch(e => reject(e) );
        });
    }

    searchByActors( name, lang ) {
        return new Promise ( (resolve, reject) => {
            
            // search for actors
            this._tmdb.search.person({
                query: name,
                language: lang,
            })

            .then(response => {
                const series = [];

                response.results.forEach( actor => {
                    
                    actor.known_for.forEach( serie => {

                        // only accept serie
                        if( serie.media_type != 'tv') {
                            return;
                        }

                        // convert serie to local format
                        const converted = this.formatSerie(serie, lang);

                        // convert actor to local format & save it
                        converted.actors = [this.formatActor( actor )];

                        // add serie
                        series.push(converted);
                    });
                
                });
                
                resolve( series);
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
    
    formatSerie( serie, lang) {
       
        return {
            api_id: serie.id,
            title: serie.original_name,
            createdAt: new Date(),
            updatedAt: new Date(),
            langCode: lang,
            validated: false,
            overview: serie.overview,
            poster: serie.poster_path,
        };
    }

    formatActor( actor) {
        return {
            api_id: actor.id,
            name: actor.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
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