const Serie = require('./../schemas/SerieSchema');

class SerieModel {

    registerInDb(local_id, api_id, title, overview, poster, genres, actors, createdAt, langCode, validated, episodes, comments) {
        return new Promise((resolve, reject) => {
            Serie.create({
                local_id: local_id,
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
                episodes: episodes, // là je suis pas sûr
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

    findByTitle(title) {
        return new Promise((resolve, reject) => {
            Serie.findOne({
                title: title,
            })
                .then(serie => resolve(serie))
                .catch(e => reject(e))
        });
    }

    findByActor(actor) {
        return new Promise((resolve, reject) => {
            Serie.findOne({
                actor: actor,
            })
                .then(serie => resolve(serie))
                .catch(e => reject(e))
        });
    }
}

module.exports = SerieModel;