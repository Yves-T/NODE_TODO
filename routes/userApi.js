const _ = require('underscore');
const bcrypt = require('bcrypt');

module.exports = function (app, db) {
    app.post('/users', function (req, res) {
        var body = req.body;

        body = _.pick(body, 'email', 'password');

        db.user.create(body).then((user) => {
            res.json(user.toPublicJSON());
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    app.post('/users/login', function (req, res) {
        var body = req.body;
        body = _.pick(body, 'email', 'password');

        db.user.authenticate(body).then((user) => {
            const token = user.generateToken('authentication');
            if (token) {
                res.header('Auth', token).json(user.toPublicJSON());
            } else {
                res.status(401).send();
            }

        }, () => {
            res.status(401).send();
        });
    });

};