const _ = require('underscore');
const passportService = require('../services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});

module.exports = (app, db) => {

    app.get('/list/:listId/todos', requireAuth, function (req, res) {
        var query = req.query;
        const listId = parseInt(req.params.listId, 10);
        const userId = req.user.get('id');
        var where = {
            listId: listId
        };

        if (query.hasOwnProperty('completed')) {
            where.completed = query.completed === 'true';
        }

        if (query.hasOwnProperty('q') && query.q.length > 0) {
            where.description = {
                $like: `%${query.q}%`
            }
        }

        getList(listId, userId).then((list) => {
            if(!!list) {
                list.getTodos({where}).then((todos) => {
                    res.json(todos);
                });
            } else {
                res.status(404).json({"error": " no list found with that id"});
            }

        }).catch((error) => res.status(500).send);
    });

    app.get('/list/:listId/todos/:id', requireAuth, function (req, res) {
        const todoId = parseInt(req.params.id, 10);
        const listId = parseInt(req.params.listId, 10);

        const where = {
            id: todoId,
            listId: listId
        };

        db.todo.findOne({where}).then((todo) => {
            if (!!todo) {
                res.json(todo.toJSON());
            } else {
                res.status(404).send();
            }

        }).catch((error)=>res.status(500).json(error));

    });

    app.post('/list/:listId/todos', requireAuth, function (req, res) {
        var body = req.body;
        const listId = parseInt(req.params.listId, 10);
        const userId = req.user.get('id');

        body = _.pick(body, 'description', 'completed');

        getList(listId, userId).then((list) => {
            db.todo.create(body).then((todo) => {
                list.addTodo(todo).then(() => {
                    return todo.reload();
                }).then((todo) => {
                    res.json(todo.toJSON());
                });
            });
        }).catch((error) => {
            res.status(400).send(error);
        });

    });

    app.delete('/list/:listId/todos/:id', requireAuth, function (req, res) {
        const todoId = parseInt(req.params.id, 10);
        const listId = parseInt(req.params.listId, 10);

        db.todo.destroy({
            where: {
                id: todoId,
                listId: listId
            }
        })
            .then((numberOfRowsDeleted) => {
                if (numberOfRowsDeleted > 0) {
                    res.status(204).send();
                } else {
                    res.status(404).json({"error": " no todo found with that id"});
                }

            })
            .catch((error) => res.status(500).send());
    });

    app.put('/list/:listId/todos/:id', requireAuth, function (req, res) {
        const todoId = parseInt(req.params.id, 10);
        const listId = parseInt(req.params.listId, 10);
        var body = req.body;
        body = _.pick(body, 'description', 'completed');
        var attributes = {};
        if (body.hasOwnProperty('completed')) {
            attributes.completed = body.completed;
        }

        if (body.hasOwnProperty('description')) {
            attributes.description = body.description;
        }

        const where = {
            id: todoId,
            listId: listId
        };

        db.todo.findOne({where})
            .then((todo) => {
            if (todo) {
                todo.update(attributes)
                    .then((todo) => {
                        res.json(todo.toJSON());
                    }, (error) => res.status(400).json(error));
            } else {
                res.status(404).send();
            }
        }, () => {
            res.status(500).send();
        })

    });

    function getList(listId, userId) {
        const where = {
            userId: userId,
            id: listId
        };
        return db.list.findOne({where});
    }
};