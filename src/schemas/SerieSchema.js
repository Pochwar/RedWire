const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ActorSchema = require('./ActorSchema');
const CommentSchema = require('./CommentSchema');

// EpisodeSchema is nested (embeded) in seriesSchema
const EpisodeSchema = new Schema({
    api_id: {
        type: Number,
    },
    number: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
    },
    overview: {
        type: String,
    },
    season: {
        type: Number,
        required: true,
    },
    viewedBy: {
        type: [Schema.Types.ObjectId,],
    },
    airDate: {
        type: Date,
        default: Date.now,
    },
})

const serieSchema = new Schema({
    // local_id: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    api_id: {
        type: Number,
    },
    title: {
        type: String,
        minlength: 1,
        required: true,
        //unique: true,
    },
    overview: {
        type: String,
    },
    poster: {
        type: String,
    },
    genres: {
        type: [String,],
    },
    actors: {
        type: [ActorSchema,],
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
        type: [EpisodeSchema,],
    },
    comments: {
        type: [CommentSchema,],
    },
    followedBy: {
        type: [Schema.Types.ObjectId,],
    },
});

module.exports = serieSchema;