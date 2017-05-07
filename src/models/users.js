//import mongoose
import mongoose from 'mongoose';

export default class UserModel {
    constructor() {
        this.user = mongoose.model('User', {
            firstname: {
                type: String,
                minlength: 3,
                maxlength: 20,
                required: true,
            },
            lastname: {
                type: String,
                minlength: 3,
                maxlength: 20,
                required: true,
            },
            pseudo: {
                type: String,
                minlength: 3,
                maxlength: 20,
                required: true,
                unique: true,
            },
            bDay: {
                type: Date,
                required: true,
            },
            mail: {
                type: String,
                required: true,
                unique: true,
            },
            inscrDay: {
                type: Date,
                required: true,
            },
            pass: {
                type: String,
                required: true,
            },
            avatar: {
                type: String,
                required: true,
            },
            ban: {
                type: Boolean,
                required: true,
            },
            lanId: {
                type: Number,
                required: true,
            },
            roleId: {
                type: Number,
                required: true,
            },
        });
    }

    save(firstname, lastname, pseudo, bDay, mail, inscrDay, pass, avatar, ban, lanId, roleId){
        this.user.create({
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
            roleId: roleId,
        })
            .then(() => {
                console.log(`User ${firstname} created`);
            })
            .catch(err => console.log(`Error : ${err.message}`))
        ;
    }
}