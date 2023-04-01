//npm install mongoose@5.10.9 mongoose-currency@0.2.0 --legacy-peer-deps
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
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
    cost:{
        type: Currency,
        required: true,
        min: 0
    },
    featured:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports =  Promotion;
