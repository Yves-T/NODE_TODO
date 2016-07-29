const _ = require('underscore');
const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});
const async = require('async');
const crypto = require('crypto');
const mailService = require('../mail/mailService');

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
        body.lists = [{'title': 'empty list'}];

        db.user.create(body, {
            include: [db.list]
        }).then((user) => {
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

    app.post('/users/forgot', function (req, res, next) {
        var body = req.body;
        body = _.pick(body, 'email');

        async.waterfall([

            // generate token

            (done) => {
                crypto.randomBytes(20, (err, buf) => {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },

            // persist user

            (token, done) => {

                const where = {
                    email: body.email,
                };

                db.user.findOne({where}).then((user) => {
                    done(null, token, user);
                }).catch((error) => {
                    console.log(error);
                    done(error);
                });
            },
            (token, user, done) => {
                if (!!user) {
                    // expire 1 hour from now
                    var attributes = {
                        resetPasswordToken: token,
                        resetPasswordExpires: Date.now() + 3600000
                    };

                    user.update(attributes)
                        .then((updatedUser) => {
                            done(null, token, updatedUser)
                        })
                        .catch((error) => {
                            console.log('catch' + error);
                            done(error, token, user)
                        });
                } else {
                    res.status(404).send();
                }
            },
            (token, updatedUser, done) => {
                updatedUser.reload().then((user)=> {
                    done(null, token, user.toJSON())
                }).catch((error) => {
                    console.log('catch' + error);
                    done(error, token, updatedUser)
                });
            },

            // send email

            (token, user, done) => {

                mailService.sendResetMail(user.email, req.headers.host, token, (err)=> {
                    if (err) {
                        console.log('Error: ' + err);
                        done(err, 'done');
                    } else {
                        res.status(204).send();
                        done(null, 'done');
                    }
                });
            }
        ], (err) => {
            if (err) {
                res.status(400).send(err);
                return next(err);
            }
        });

    });

    app.get('/users/reset/:token', function (req, res) {

        const where = {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        };

        db.user.findOne({where})
            .then((user)=> {
                if (!!user) {
                    res.status(204).send();
                } else {
                    res.status(403).send({error: 'Password reset token is invalid or has expired.'});
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send();
            });
    });

    app.post('/users/reset/:token', function (req, res, next) {
        var body = req.body;
        body = _.pick(body, 'newPassword');

        const token = req.params.token;

        const where = {
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        };

        async.waterfall([
            // update the user
            (done) => {
                db.user.findOne({where})
                    .then((user) => {
                        done(null, user);
                    })
                    .catch((error) => {
                        console.log(error);
                        done(error);
                    });
            },

            (user, done) => {
                if (!!user) {
                    var attributes = {
                        password: body.newPassword,
                        resetPasswordToken: null,
                        resetPasswordExpires: null
                    };
                    user.update(attributes)
                        .then((updatedUser) => {
                            done(null, updatedUser.toJSON())
                        })
                        .catch((error) => {
                            console.log('catch' + error);
                            done(error, user)
                        });
                } else {
                    res.status(400).send({error: 'Password reset token is invalid or has expired.'});
                }
            },

            // send email

            (user, done) => {
                mailService.sendPasswordChangedMail(user.email, (err) => {
                    if (err) {
                        console.log('Error: ' + err);
                        done(err, 'done');
                    } else {
                        res.status(204).send();
                        done(null, 'done');
                    }
                });
            }

        ], (err) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            }
        });
    });

};
