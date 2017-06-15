const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    note: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updateAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    validated: {
        type: Boolean,
    },
    langId: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    userPseudo: {
        type: String,
        required: true,
    },
    usersLike: {
        type: [{
            user: {
                type: Schema.Types.ObjectId,
            },
            like: {
                type: Boolean,
            },
        }, ],
    },
    serie: {
        type: Schema.Types.ObjectId,
    },
});
module.exports = commentSchema;