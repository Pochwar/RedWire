const UserSchema = require( './../schemas/UserSchema');

class UserModel {

    registerInDb(firstname, lastname, pseudo, bDay, mail, createdAt, pass, avatar, ban, lanId, roleId){
        return new Promise((resolve, reject) => {
            UserSchema.create({
                firstname: firstname,
                lastname: lastname,
                pseudo: pseudo,
                bDay: bDay,
                mail: mail,
                createdAt: createdAt,
                updatedAt: createdAt,
                pass: pass,
                avatar: avatar,
                ban: ban,
                lanId: lanId,
                roleId : roleId,
            },(err, object) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(object)
                }
            });
        })
    }

    findByMail(mail){
        return new Promise((resolve, reject) => {
            UserSchema.findOne({
                mail: mail,
            })
                .then(user => resolve(user))
                .catch(e => reject(e))
        });
    }

    static findById( id) {
       
        return UserSchema.findOne({
            _id: id,
        });
        
    }

}

module.exports = UserModel;