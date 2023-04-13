const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { facebook } = require('../config');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String
});

userSchema.plugin(passportLocalMongoose); //To replace the username and password removed from the schema): 

module.exports = mongoose.model('User', userSchema);