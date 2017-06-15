const mongoose = require('mongoose');
const SerieSchema = require('./../schemas/SerieSchema');
const ActorSchema = require('./../schemas/ActorSchema');
const Serie = mongoose.model('Serie', SerieSchema);
const Actor =  mongoose.model('Actor', ActorSchema);

class SerieModel {

    constructor(resultPerPage, siteImagePath, apiImagePath) {
        this._resultPerPage = resultPerPage;
        this._siteImagePath = siteImagePath;
        this._apiImagePath = apiImagePath;

        this.findAll = this.findAll.bind(this);
        this.findByTitle = this.findByTitle.bind(this);
        this.findBy = this.findBy.bind(this);
        this.actorRequest = this.actorRequest.bind(this);
        this.titleRequest = this.titleRequest.bind(this);
        this.allRequest = this.allRequest.bind(this);
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
        // const api_id = optionals.api_id || null;
        // const overview = optionals.overview || null;
        // const poster = optionals.poster || "/img/default.png";
        // const genres = optionals.genres || [];
        // const actors = optionals.actors || [];
        // const comments = optionals.comments || [];
        // const episodes = optionals.episodes || [];
        // const validated = optionals.validated || 0;

        return new Promise((resolve, reject) => {
            let actors = [];

            if(optionals.actors){
                actors = optionals.actors.map((actor) => {
                    return {name: actor};
                })
            }
            console.log(title);
            Serie.create({
                api_id: optionals.api_id,
                title: title,
                overview: optionals.overview,
                poster: optionals.poster,
                genres: optionals.genres,
                actors: actors,
                createdAt: createdAt,
                updatedAt: createdAt,
                langCode: langCode,
                validated: optionals.validated,
                episodes: optionals.episodes,
                comments: optionals.comments,
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
    findAll(lang, page) {
        return this.findBy('all', null, lang, page);
    }

    /**
     * @method
     * @param {String} title - The title user wants to search for
     * @return {Promise} Should return an array containing the series matching the title param
     */
    findByTitle(title, lang, page = null) {
       return this.findBy('title', title, lang, page);
    }

    /**
     * @method
     * @param {String} actor - The actor user wants to search for
     * @return {Promise} Should return an array containing the series matching the actor param
     */
    findByActor(actor, lang, page = null)  {
        return this.findBy('actor', actor, lang, page);
    }

    // default search method
    findBy(target, query, lang, page = null) {
        
        return new Promise((resolve, reject) => {

            let data = {};

            // 1 . generate request
            let counter, docs;

            switch( target) {
                
                case 'title':
                    counter = this.titleRequest(query, lang);
                    docs = this.titleRequest(query, lang);
                    break;

                case 'actor':
                    counter = this.actorRequest(query, lang);
                    docs = this.actorRequest(query, lang);
                    break;

                case 'all':
                    counter = this.allRequest(query, lang);
                    docs = this.allRequest(query, lang);
                    break;

                default:
                    throw new Error('SerieModel - findBy - wrong target specified');

            }

            // 2. counter request
            counter.count();

            //3. skip & limit for documents
            if (page) {
                docs.skip(page * this._resultPerPage);
            }

            // limit
            docs.limit(this._resultPerPage);

            // run counter request
            counter.exec()

            // save data & run pagination request
            .then(number => {
                data.total = number;
                data.pages = Math.ceil(number / this._resultPerPage);

                return docs.exec();
            })
            // transform data & resolve
            .then(series => {
                data.series = series.map(serie => this.transformImagePath(serie));
                resolve(data);
            })
            .catch(e => reject(e))
        });
    }

    // generate request for all series
    allRequest(title, lang) {
        return Serie.find({});
    }

    // generate request for title
    titleRequest(title, lang) {
        return Serie.find({
            title: new RegExp(title, 'i'),
            langCode: lang
        });
    }

    // generate request for actors
    actorRequest(actor, lang) {
        return Serie.find({
            "langCode": lang,
            "actors.name": new RegExp(actor, 'i'),
        });
    }

    /**
     * @method
     * @param {String} id - serie's Id (alpha-numeric string in ObjectId()) in DB
     * @return {Promise<Object|String>} A series object matching the id param
     */
    findById(id) {
        return new Promise((resolve, reject) => {
            Serie.findOne({
                _id: id,
            })
                .then(serie => {
                    if (serie) {
                        resolve(serie.toObject());
                    }
                    else {
                        resolve({});
                    }
                })
                .catch(e => reject(e));
        });
    }

    /**
     * @method
     * @param {String} id - serie's Id (alpha-numeric string in ObjectId()) in DB
     * @return {Promise<Object|String>} A series object matching the id param
     */
    findEpisodeById(id) {
        return new Promise((resolve, reject) => {
            Serie.findOne({
                'episodes._id': id,
            },
            {
                'episodes.$': 1,
            })
            .then(serie => {
                if (serie) {
                    resolve(serie.toObject());
                }
                else {
                    resolve({});
                }
            })
            .catch(e => reject(e));
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
                api_id: apiId,
            })
                .then(series => {
                    if (series) {
                        resolve(series.toObject());
                    }
                    else {
                        resolve({});
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
    insertApiSerie(serie) {
        return new Promise((resolve, reject) => {
            Serie.update(
                { api_id: serie.api_id, langCode: serie.langCode, },
                { $setOnInsert: serie, },
                { upsert: true, }
            )
                .then(result => {
                    resolve();
                })
                .catch(e => reject(e));
        });
    }

    transformImagePath(serie) {

        if (!serie.poster) {
            return serie;
        }

        if (serie.api_id) {
            serie.poster = this._apiImagePath + serie.poster;
        }
        else {
            serie.poster = this._siteImagePath + serie.poster;
        }

        return serie;
    }

    followSerie(user, serie) {
        return new Promise((resolve, reject) => {
            Serie.update({ _id: serie }, { $push: { followedBy: user} })
            .then(result => {
                resolve();
            })
            .catch(error => {
                reject(error);
            });
        });
    }

}

module.exports = SerieModel;