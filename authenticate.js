const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config.js');
const FacebookTokenStrategy = require('passport-facebook-token');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

//The jwtPassport function uses the JwtStrategy constructor to create a new strategy for authenticating users.
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);//The jwt_payload argument is an object containing the decoded JWT payload.
            User.findOne({_id: jwt_payload._id}, (err, user) => { //To call User.findOne() to search for a user with an _id property that matches the _id property in the JWT payload.
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next)=>{
    if(req.user.admin){
        return next();
    }else{
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403; //Unauthorized
        return next(err);
    }
};
//Set up Facebook authentication strategy
exports.facebookPassport = passport.use(
    new FacebookTokenStrategy(
        {
            clientID: config.facebook.clientId,
            clientSecret: config.facebook.clientSecret
        }, 
        (accessToken, refreshToken, profile, done) => {
            User.findOne({facebookId: profile.id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (!err && user) {
                    return done(null, user);
                } else {
                    user = new User({ username: profile.displayName });
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
);


/* 
//Express passport-jwt authenticate.verifyAdmin: if(req.user.admin) .verifyUser: if(user)
//if((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id))

//uers 
req = {
    user: {
        _id: 282828,
        firstname: "Ha",
        ...
        admin: true
    }
}
//mongoose population: .populate('campsites.comments.author')
//campsite.comments.id(campsite.comments[i]._id).remove();

campsite = {
    comments:[
        {
            _id: 2828282
            ...
            author: {
                _id: 282828
            } 
        },
        {
            _id: 1228282
            ...
            author: {
                _id: 282828
            } 
        }

    ]
}
*/