//npm install mongoose@5.10.9 mongoose-currency@0.2.0 --legacy-peer-deps
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

//To add a subDocument to a document
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1, 
        max: 5, 
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        requried: true
    },
    elevation:{
        type: Number,
        required: true
    },
    cost:{
        type: Currency,
        required: true,
        min: 0
    },
    featured:{
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports =  Campsite;
