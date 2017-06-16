const UserSchema = require('./../schemas/UserSchema');
const ObjectId = require('mongodb').ObjectID;
const winston = require('winston');

class UserModel {

    registerInDb(firstname, lastname, pseudo, birthday, mail, createdAt, password, ban, langId, roleId) {
        return new Promise((resolve, reject) => {
            UserSchema.create({
                firstname: firstname,
                lastname: lastname,
                pseudo: pseudo,
                birthday: birthday,
                mail: mail,
                createdAt: createdAt,
                updatedAt: createdAt,
                password: password,
                ban: ban,
                langId: langId,
                roleId: roleId,
            }, (err, object) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(object)
                }
            });
        })
    }

    findByMail(mail) {
        return new Promise((resolve, reject) => {
            UserSchema.findOne({
                    mail: mail,
                })
                .then(user => {
                    if (user && user.pseudo) {
                        resolve(user.toObject());
                    } else {
                        resolve({});
                    }

                })
                .catch(e => reject(e))
        });
    }

    /**
     * @method
     * 
     * @param {String} userId - serie's Id (alpha-numeric string in ObjectId()) in DB
     * @param {String} dataToChange - attribute to change
     * @param {String|Number|Boolean} value - new value
     */

    updateData(userId, dataToChange, value) {
        // if (dataToChange === "langId"){
        //     console.log("weshhhh");
        //     value = parseInt(value);

        // }
        return new Promise((resolve, reject) => {
            let update = {};
            update[dataToChange] = value;
            UserSchema.update({ _id: ObjectId(userId) }, { $set: update })
                .then(document => {
                    winston.info("data updated");
                    resolve(document)
                })
                .catch(e => {
                    winston.info("data update error");
                    reject(e)
                })
        });
    }

    /**
     * @method
     * 
     * @param {String} userId - serie's Id (alpha-numeric string in ObjectId()) in DB
     * @param {ObjectId} episodeId - new value
     * 
     * @return {Promise}
     */
    commentedEpisode(userId, episodeId) {
        return new Promise((resolve, reject) => {
            UserSchema.update({_id: ObjectId(userId)}, { $push: { comments: episodeId }})
                .then(result => resolve(result))
                .catch(e => reject(e))
        });
    }

    /**
     * @method
     * 
     * @param {String} userId - serie's Id (alpha-numeric string in ObjectId()) in DB
     * @param {ObjectId} episodeId - new value
     * @param {Boolean} remove - is data to be removed ?
     * 
     * @return {Promise}
     */
    followedSerie(userId, serieId, remove) {
        if (remove == "false") {
            return new Promise((resolve, reject) => {
                UserSchema.update({_id: ObjectId(userId)}, { $addToSet: { seriesFollowed: serieId }})
                    .then(result => {resolve(result)})
                    .catch(e => reject(e))
            });
        } else {
            return new Promise((resolve, reject) => {
                UserSchema.update({_id: ObjectId(userId)}, { $pull: { seriesFollowed: serieId }})
                    .then(result => resolve(result))
                    .catch(e => reject(e))
            });
        }
    }

    /**
     * @method
     * 
     * @param {String} userId - serie's Id (alpha-numeric string in ObjectId()) in DB
     * @param {ObjectId} episodeId - new value
     * @param {Boolean} remove - is data to be removed ?
     * 
     * @return {Promise}
     */
    viewedEpisode(userId, episodeId, remove) {
        if (remove == "false") {
            return new Promise((resolve, reject) => {
                UserSchema.update({_id: ObjectId(userId)}, { $addToSet: { episodesViewed: episodeId }})
                    .then(result => {resolve(result)})
                    .catch(e => reject(e))
            });
        } else {
            return new Promise((resolve, reject) => {
                UserSchema.update({_id: ObjectId(userId)}, { $pull: { episodesViewed: episodeId }})
                    .then(result => resolve(result))
                    .catch(e => reject(e))
            });
        }
    }

    static findById(id) {

        return UserSchema.findOne({
            _id: id,
        });

    }

}

module.exports = UserModel;