const mongoose = require( 'mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
module.exports = mongoose.model('User', userSchema);
