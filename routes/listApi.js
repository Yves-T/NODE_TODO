const _ = require('underscore');
const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});

module.exports = (app, db) => {
    app.get('/list', requireAuth, function (req, res) {
        const userId = req.user.get('id');
        const where = {userId};

        db.list.findAll({
            where: where,
            include: [db.todo]

        }).then((result) => {
            var json = result.map((listItem) => {
                var listItemAsJson = listItem.toJSON();
                var json = _.pick(listItemAsJson, 'id', 'title', 'createdAt', 'updatedAt', 'userId');
                json.todoCount = listItemAsJson.todos.length;
                return json;
            });

            res.json(json);

        }).catch((error)=> res.status(500).send());
    });

    app.get('/list/:listId', requireAuth, function (req, res) {
        const userId = req.user.get('id');
        const listId = parseInt(req.params.listId, 10);

        const where = {
            id: listId,
            userId: userId
        };

        db.list.findOne({where}).then((list) => {
            if (!!list) {
                res.json(list.toJSON());
            } else {
                res.status(404).send();
            }

        }).catch((error)=>res.status(500).json(error));
    });

    app.post('/list', requireAuth, function (req, res) {
        var body = req.body;

        body = _.pick(body, 'title');

        db.list.create(body)
            .then((list) => {
                req.user.addList(list)
                    .then(() => {
                        return list.reload();
                    })
                    .then((list) => {
                        res.json(list.toJSON());
                    });
            })
            .catch((error) => res.status(400).send(error));
    });

    app.delete('/list/:listId', requireAuth, function (req, res) {
        const listId = parseInt(req.params.listId, 10);
        const userId = req.user.get('id');

        db.list.destroy({
            where: {
                id: listId,
                userId: userId
            }
        })
            .then((numberOfRowsDeleted) => {
                if (numberOfRowsDeleted > 0) {
                    return db.todo.destroy({
                        where: {
                            listId: null
                        }
                    });

                } else {
                    res.status(404).json({"error": " no list found with that id"});
                }
            })
            .then(() => {
                res.status(204).send();
            })
            .catch((error) => res.status(500).send());
    });

    app.put('/list/:listId', requireAuth, function (req, res) {
        const userId = req.user.get('id');
        const listId = parseInt(req.params.listId, 10);
        var body = req.body;
        body = _.pick(body, 'title');
        var attributes = {};
        if (body.hasOwnProperty('title')) {
            attributes.title = body.title;
        }

        const where = {
            id: listId,
            userId: userId
        };

        db.list.findOne({where})
            .then((list) => {
                if (list) {
                    return list.update(attributes)
                } else {
                    res.status(404).send();
                }
            }, () => res.status(500).send())
            .then((list) => res.json(list.toJSON()), (error) => res.status(400).json(error))
            .catch(() => res.status(500).send());
    });

};