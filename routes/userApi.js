const _ = require('underscore');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.sign({sub: user.get('id')}, config.jwtSecret, {
        expiresIn: 10080 // in seconds
    });
}

module.exports = function (app, db) {
    app.post('/users', function (req, res) {
        var body = req.body;

        body = _.pick(body, 'email', 'password');

        db.user.create(body).then((user) => {
            const token = tokenForUser(user);

            res.header('Auth', token).json({token});
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    app.post('/users/login', requireSignIn, function (req, res) {
        const token = tokenForUser(req.user);

        res.header('Auth', token).json({token});
    });

    app.delete('/users/logout', requireAuth, function (req, res) {
        req.logout();
        res.status(204).send();
    });

    app.get('/users/authenticate', requireAuth, function (req, res) {
        res.json(req.user.toPublicJSON());
    });

};