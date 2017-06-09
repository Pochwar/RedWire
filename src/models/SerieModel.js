const Serie = require('./../schemas/SerieSchema');
const Actor = require('./../schemas/ActorSchema');

class SerieModel {

    registerActor(local_id, name, createdAt, updatedAt) {
        return new Promise(() => {
            Actor.create({
                local_id: local_id,
                name: name,
                createdAt: createdAt,
                updatedAt: updatedAt,
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

    findByTitle(title) {
        return new Promise((resolve, reject) => {
            Serie.find({
                title: new RegExp(title, 'i'),
            })
                .then(serie => resolve(serie.toObject()))
                .catch(e => reject(e))
        });
    }

    findByActor(actor) {
        return new Promise((resolve, reject) => {
            Serie.find({
                actor: new RegExp(actor, 'i'),
            })
                .then(serie => resolve(serie.toObject()))
                .catch(e => reject(e))
        });
    }
}

module.exports = SerieModel;