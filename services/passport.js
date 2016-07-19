const passport = require('passport');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const db = require('../db');
const bcrypt = require('bcrypt');


// set up options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader('authorization'),
    secretOrKey: config.jwtSecret
};

const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {

    db.user.findOne({where: {email: email}}).then((user) => {
        if (!user || !bcrypt.compareSync(password, user.get('password_hash'))) {
            return done(null, false);
        } else {
            return done(null, user);
        }

    }, (error) => {
        return done(error);
    });

});

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {

    console.log(payload);

    const where = {
        id: payload.sub
    };

    db.user.findOne({where})
        .then((user) => {
            if (!!user) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch((error) => {
            return done(error, false);
        });
});

passport.use(jwtLogin);
passport.use(localLogin);
