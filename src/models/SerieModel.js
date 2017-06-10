const Serie = require('./../schemas/SerieSchema');
const Actor = require('./../schemas/ActorSchema');

class SerieModel {

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
     * @param {Object} optionals - An object of optionals fields
     * @param {Number} optionals.api_id - TMDB id
     * @param {String} optionals.overview - Description of the show
     * @param {String} optionals.poster - Relative URL of the poster
     * @param {String[]} optionals.genres - Genres (ie. Drama, Thriller, Action)
     * @param {ObjectId[]} optionals.actors - MongoDB _id of actors
     * @param {episodeSchema[]} optionals.episodes - Not quite sure of the structure of this one
     * @param {ObjectId[]} optionals.comments - MongoDB _id of comments
     * @param {Boolean} optionals.validated - If it was validated or not by an admin
     * 
     * @return {Promise} Should return the registered document
     */
    registerSerie(title, createdAt, langCode, optionals) {
        const api_id = optionals.api_id || null;
        const overview = optionals.overview || null;
        const poster = optionals.poster || null;
        const genres = optionals.genres || [];
        const actors = optionals.actors || [];
        const episodes = optionals.episodes || [];
        const comments = optionals.comments || [];
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
    findByTitle(title) {
        return new Promise((resolve, reject) => {
            Serie.find({
                title: new RegExp(title, 'i'),
            })
                .then(series => resolve(series.toObject()))
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
                {api_id: serie.api_id}, 
                {$setOnInsert: serie}, 
                {upsert: true}
            )
            .then(result => {
               resolve();
            })
            .catch(e => reject(e));
        });
    }
}

module.exports = SerieModel;