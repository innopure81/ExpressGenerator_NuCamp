const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites:[{
        type: Schema.Types.ObjectId,
        ref: 'Campsite'
    }] //Square brackets: To enable to contain an array of multiple campsite IDs in this field
}, {
        timestamps: true
});

module.exports = mongoose.model('Favorite', favoriteSchema);