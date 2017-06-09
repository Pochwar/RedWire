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

    registerSerie(local_id, title, createdAt, langCode, validated) {
        return new Promise((resolve, reject) => {
            Serie.create({
                local_id: local_id,
                title: title,
                createdAt: createdAt,
                updatedAt: createdAt,
                langCode: langCode,
                validated: validated,
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
     * @return {Array} A array containing all the series in DB
     */
    findAll() {
        return new Promise((resolve, reject) => {
            Serie.find({})
                .then(series => resolve(series.toObject()))
                .catch(e => reject(e))
        })
    }

    /**
     * @method
     * @param {String} title - The title user wants to search for
     * @return {Array} A array containing the series matching the title param
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
     * @return {Array} A array containing the series matching the actor param
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
}

module.exports = SerieModel;