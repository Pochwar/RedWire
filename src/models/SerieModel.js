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
     * @param {Number} api_id 
     * @param {String} title 
     * @param {String} overview 
     * @param {String} poster 
     * @param {Array} genres 
     * @param {Array} actors 
     * @param {Date} createdAt 
     * @param {Date} langCode 
     * @param {Boolean} validated 
     * @param {episodeSchema[]} episodes 
     * @param {Array} comments 
     * 
     * @return {Promise} Should return the registered document
     */
    registerSerie(api_id, title, overview, poster, genres, actors, createdAt, langCode, validated, episodes, comments) {
        return new Promise((resolve, reject) => {
            Serie.create({
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