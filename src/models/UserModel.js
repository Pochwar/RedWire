const UserSchema = require( './../schemas/UserSchema');

class UserModel {

    registerInDb(firstname, lastname, pseudo, birthday, mail, createdAt, password, ban, langId, roleId){
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
                .then(user => resolve(user.toObject()))
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