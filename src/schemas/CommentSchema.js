const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
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
        type: Number,
    },
});
module.exports = mongoose.model('Comments', commentsSchema);