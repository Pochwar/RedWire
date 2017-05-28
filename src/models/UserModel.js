import UserSchema from './../schemas/UserSchema';

export default class User {

    registerInDb(firstname, lastname, pseudo, bDay, mail, inscrDay, pass, avatar, ban, lanId, roleId){
        return new Promise((resolve, reject) => {
            const create = UserSchema.create({
                firstname: firstname,
                lastname: lastname,
                pseudo: pseudo,
                bDay: bDay,
                mail: mail,
                inscrDay: inscrDay,
                pass: pass,
                avatar: avatar,
                ban: ban,
                lanId: lanId,
                roleId : roleId
            },(err, object) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(object)
                }
            });
        })
    }

    connectz(pseudo, pass){
        const prom = new Promise((resolve, reject) => {
            AppUserSchema.findOne({
                username: pseudo
            })
                .then(user => resolve(user))
                .catch(e => reject(e))
        });
        return prom;
    }
}