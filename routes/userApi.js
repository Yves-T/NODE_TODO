const _ = require('underscore');

module.exports = function (app, db) {
    app.post('/users', function (req, res) {
        var body = req.body;

        body = _.pick(body, 'email', 'password');

        db.user.create(body).then((user) => {
            res.json(user.toJSON());
        }).catch((error) => {
            res.status(400).send(error);
        });
    });
};