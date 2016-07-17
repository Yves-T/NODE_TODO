const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed')) {
        where.completed = query.completed === 'true';
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: `%${query.q}%`
        }
    }

    db.todo.findAll({where}).then((todos) => {
        res.json(todos);
    }).catch((error) => res.status(500).send);

});

app.get('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then((todo) => {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }

    }).catch((error)=>res.status(500).json(error));

});

app.post('/todos', function (req, res) {
    var body = req.body;

    body = _.pick(body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || _.isString(!body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    db.todo.create(body).then((todo) => {
        body.id = todoNextId++;
        todos.push(body);
        res.json(todo.toJSON());
    }).catch((error) => res.status(400).json(error));

});

app.delete('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    db.todo.destroy({
        where: {
            id: todoId
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

app.put('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);
    var body = req.body;
    body = _.pick(body, 'description', 'completed');
    var validAttributes = {};
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (!matchedTodo) {
        return res.status(404).send();
    }

    _.extend(matchedTodo, validAttributes);

    res.json(matchedTodo);
});


db.sequelize.sync().then(function () {

    app.listen(PORT, function () {
        console.log('Express listening on port: ' + PORT);
    });

});