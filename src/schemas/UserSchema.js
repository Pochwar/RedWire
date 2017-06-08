const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

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
    birthday: {
        type: Date,
        required: true,
    },
    mail: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    password: {
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
    langId: {
        type: Number,
        required: true,
    },
    roleId: {
        type: Number,
        required: true,
    },
    seriesFollowed: {
        type: [Schema.Types.ObjectId, ],
    },
    seriesModified: {
        type: [{
            serie: {
                type: Number,
                required: true,
            },
            version: {
                type: ObjectId,
            },
        }, ],
    },
    seriesNote: {
        serie: {
            type: Number,
            required: true,
        },
        note: {
            type: Number,
        },

    },
    episodeViewed: {
        type: [Schema.Types.ObjectId, ],
    },
    comments: {
        type: [Schema.Types.ObjectId, ],

    },
    commentsLike: {
        type: [{
            comments: {
                type: Schema.Types.ObjectId,
            },
        }, ],
    },
});
module.exports = mongoose.model('User', userSchema);