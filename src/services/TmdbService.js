// service pour l'api tmdb
const TmdbApi = require('tmdbapi');

class TmdbService {

    constructor( apiKey) {
        this._tmdb = new TmdbApi({apiv3: apiKey});

        this.searchByTitle = this.searchByTitle.bind(this);
        this.searchByActors = this.searchByActors.bind(this);
        this.getSerie = this.getSerie.bind(this);
        this.toLocalFormat = this.toLocalFormat.bind(this);
    }

    searchByTitle( title, lang) {
        
        return new Promise( (resolve, reject) => {
            
            this._tmdb.search.tv({
                query: title,
                language: lang
            })
            .then( response => {
                const series = response.results.map( serie => this.toLocalFormat(serie, lang));
                resolve( series);
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
                 const series = response.results.map( serie => this.toLocalFormat(serie, lang));
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
    
    toLocalFormat( serie, lang) {
        
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