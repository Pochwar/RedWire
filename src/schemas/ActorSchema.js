const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actorSchema = new Schema({
    // local_id: {
    //     type: Number,
    //     required: true,
    // },
    api_id: {
        type: Number,
    },
    name: {
        type: String,
        required: true,
    },
    series: {
        type: [Number, ],
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
});
module.exports = actorSchema;