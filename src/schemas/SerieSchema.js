const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// episodeSchema is nested (embeded) in seriesSchema
const episodeSchema = new Schema({
    local_id: {
        type: Number,
    },
    api_id: {
        type: Number,
    },
    number: {
        type: Number,
    },
    title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
    },
    season: {
        type: Number,
    },
    viewedBy: {
        type: [Schema.Types.ObjectId, ],
    },
    airDate: {
        type: Date,
        default: Date.now,
    },
})

const serieSchema = new Schema({
    local_id: {
        type: Number,
        required: true,
        unique: true,
    },
    api_id: {
        type: Number,
    },
    title: {
        type: String,
        minlength: 1,
        required: true,
        unique: true,
    },
    overview: {
        type: String,
    },
    poster: {
        type: String,
    },
    genres: {
        type: [String, ],
    },
    actors: {
        type: [String, ],
    },
    score: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    langCode: {
        type: String,
        required: true,
    },
    validated: {
        type: Boolean,
    },
    episodes: {
        type: [episodeSchema, ],
    },
    comments: {
        type: [Schema.Types.ObjectId, ],
    },
    followedBy: {
        type: [Schema.Types.ObjectId, ],
    },
});

module.exports = mongoose.model('Serie', serieSchema);