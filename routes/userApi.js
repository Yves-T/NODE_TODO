const _ = require('underscore');
const bcrypt = require('bcrypt');

module.exports = function (app, db, middleware) {
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
        var userInstance;

        db.user.authenticate(body).then((user) => {
            const token = user.generateToken('authentication');
            userInstance = user;

            return db.token.create({
                token: token
            });

        }).then((tokenInstance) => {
            res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
        }).catch(() => {
            res.status(401).send();
        });
    });

    app.delete('/users/login', middleware.requireAuthentication, function (req, res) {
        req.token.destroy().then(() => {
            res.status(204).send();
        }).catch(() => {
            res.status(500).send();
        })
    });

};