const winston = require('winston');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const SerieSchema = require('./../schemas/SerieSchema');
const CommentSchema = require('./../schemas/CommentSchema');
const ActorSchema = require('./../schemas/ActorSchema');
const Serie = mongoose.model('Serie', SerieSchema);
const Actor =  mongoose.model('Actor', ActorSchema);
const Comment = mongoose.model('Comments', CommentSchema);

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

            // run counter request
            counter.exec()

            // save data & run pagination request
            .then(number => {

                // number of results & pages
                data.total = number;
                data.pages = Math.ceil(number / this._resultPerPage);

                //3. skip & limit for documents if valid page
                if (page && page <= data.pages) {
                    docs.skip(page * this._resultPerPage);
                }

                // limit
                docs.limit(this._resultPerPage);

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
                    serie.toObject();
                    serie.poster = serie.poster ? this._siteImagePath + serie.poster : null;
                    resolve(serie);
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

    followSerie(user, serie, remove) {
        winston.info(user)
        winston.info(serie)
        if (remove == "false") {
            return new Promise((resolve, reject) => {
            Serie.update({ _id: ObjectId(serie) }, { $addToSet: { followedBy: user} })
            .then(result => resolve(result))
            .catch(error => reject(error))
        });
        } else {
            return new Promise((resolve, reject) => {
                Serie.update({ _id: ObjectId(serie) }, { $pull: { followedBy: user} })
                .then(result => resolve(result))
                .catch(error => reject(error))
            });
        }
    }

    
    /**
     * @method
     * 
     * @param {ObjectId} userId 
     * @param {String} userPseudo 
     * @param {Number} langId 
     * @param {ObjectId} serieId 
     * @param {String} commentTitle 
     * @param {String} commentBody 
     * @param {Number} commentRating 
     */
    addComment(userId, userPseudo, langId, serieId, commentTitle, commentBody, commentRating) {
        return new Promise((resolve, reject) => {
            Serie.findOneAndUpdate({ _id: serieId }, { $push:
                {
                    comments:
                        {
                        title: commentTitle,
                        body: commentBody,
                        serie: serieId,
                        note: commentRating,
                        user: userId,
                        userPseudo: userPseudo,
                        langId: langId,
                        }   
                    }
                }, {
                    new: true,
                }
            )
            .then((result) => {
                resolve(result.toObject())
                })
            .catch(error => {
                reject(error);
            });
        })
    }
}

module.exports = SerieModel;