const Serie = require('./../schemas/SerieSchema');
const Actor = require('./../schemas/ActorSchema');

class SerieModel {

    constructor( resultPerPage ,siteImagePath, apiImagePath ) {
        this._resultPerPage = resultPerPage;
        this._siteImagePath = siteImagePath;
        this._apiImagePath = apiImagePath;

        this.findByTitle = this.findByTitle.bind(this);
        this.transformImagePath = this.transformImagePath.bind(this);
    }

    registerActor(local_id, name, createdAt, updatedAt) {
        return new Promise((resolve, reject) => {
            Actor.create({
                local_id: local_id,
                name: name,
                createdAt: createdAt,
                updatedAt: updatedAt,
            }, (err, object) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(object)
                }
            })
        })
    }

    /**
     * @method
     * 
     * @param {String} title - The title of the TV show
     * @param {Date} createdAt - When it was created
     * @param {String} langCode - In which langage it is written ("en" or "fr")
     * @param {Object} [optionals] - An object of optionals fields
     * @param {Number} [optionals.api_id=null] - TMDB id of the TV show
     * @param {String} [optionals.overview=null] - Description of the show
     * @param {String} [optionals.poster=null] - Relative URL of the poster
     * @param {String[]} [optionals.genres=empty] - Genres (ie. Drama, Thriller, Action)
     * @param {ObjectId[]} [optionals.actors=empty] - MongoDB _id of Actors
     * @param {ObjectId[]} [optionals.comments=empty] - MongoDB _id of Comments
     * @param {Object[]} [optionals.episodes=empty] - Array of Object episodes
     * @param {Number} optionals.episodes.api_id - TMDB id of the episode
     * @param {Number} optionals.episodes.number - The number of the episode
     * @param {String} optionals.episodes.title - The title of the episode
     * @param {String} optionals.episodes.overview - Description of the episode
     * @param {Number} optionals.episodes.season - Wich season it belongs to
     * @param {ObjectId[]} optionals.episodes.viewedBy - MongoDB _id of Users
     * @param {Date} optionals.episodes.airDate - Date when it was or will be on air
     * @param {Boolean} [optionals.validated=0] - If it was validated or not by an admin
     * 
     * @return {Promise} Should return the registered document
     */
    registerSerie(title, createdAt, langCode, optionals) {
        const api_id = optionals.api_id || null;
        const overview = optionals.overview || null;
        const poster = optionals.poster || null;
        const genres = optionals.genres || [];
        const actors = optionals.actors || [];
        const comments = optionals.comments || [];
        const episodes = optionals.episodes || [];
        const validated = optionals.validated || 0;

        return new Promise((resolve, reject) => {
            Serie.create({
                local_id: 1,
                api_id: api_id,
                title: title,
                overview: overview,
                poster: poster,
                genres: genres,
                actors: actors,
                createdAt: createdAt,
                updatedAt: createdAt,
                langCode: langCode,
                validated: validated,
                episodes: episodes,
                comments: comments,
            }, (err, object) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(object)
                }
            });
        })
    }

    /**
     * @method
     * @return {Promise} Should return an array containing all the series in DB
     */
    findAll() {
        return new Promise((resolve, reject) => {
            Serie.find({})
                .then(series => resolve(series))
                .catch(e => reject(e))
        })
    }

    /**
     * @method
     * @param {String} title - The title user wants to search for
     * @return {Promise} Should return an array containing the series matching the title param
     */
    findByTitle(title, lang) {
        return new Promise((resolve, reject) => {
            
            let data = {};

            // 1. counter request
            const counter = Serie.find({
                title: new RegExp(title, 'i'),
                langCode: lang
            }).count();

            // 2. pagination request
            const docs = Serie.find({
                title: new RegExp(title, 'i'),
                langCode: lang
            }).limit( this._resultPerPage);
            
            // run counter request
            counter.exec()

            // save data & run pagination request
            .then( number => {
                data.total = number;
                data.pages = Math.ceil(number / this._resultPerPage);

                return docs.exec();
            })
            // transform data & resolve
            .then(series => {
                data.series = series.map( serie => this.transformImagePath(serie));  
                resolve(data);
            })
            .catch(e => reject(e))
        });
    }

    /**
     * @method
     * @param {String} actor - The actor user wants to search for
     * @return {Promise} Should return an array containing the series matching the actor param
     */
    findByActor(actor) {
        return new Promise((resolve, reject) => {
            Serie.find({
                // actors: new RegExp(actor, 'i'),
                actors: {
                    "$regex": actor,
                    "$options": "i",
                },
            })
                .then(series => resolve(series.toObject()))
                .catch(e => reject(e))
        });
    }

    /**
     * @method
     * @param {Integer} apiId - serie's Id in the api
     * @return {Promise<Array|String>} A array containing the series matching the tmdbId param
     */
    findByApiId(apiId) {
        return new Promise((resolve, reject) => {
            Serie.findOne({
                api_id: apiId
            })
            .then(series => {
                if( series) {
                    resolve(series.toObject() );
                }
                else {
                    resolve( {} );
                }
            })
            .catch(e => reject(e));
        });
    }

    /**
     * @method
     * @param {Object} serie - serie returned from the distant api
     * @return {Promise<bool>} Promise with boolean
     */
    addIfNotExits(serie) {
        return new Promise((resolve, reject) => {
            
            Serie.update(
                {api_id: serie.api_id, langCode: serie.langCode}, 
                {$setOnInsert: serie},
                {upsert: true}
            )
            .then(result => {
                resolve();
            })
            .catch(e => reject(e));
        });
    }

    transformImagePath( serie ) {
        
        if( !serie.poster) {
            return serie;
        }
        
        if( serie.api_id) {
            serie.poster = this._apiImagePath + serie.poster;
        }
        else {
            serie.poster = this._siteImagePath + serie.poster;
        }
        
        return serie;
    }
}

module.exports = SerieModel;