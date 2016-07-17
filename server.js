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
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(todos, {'completed': true});
    } else if ((queryParams.hasOwnProperty('completed') && queryParams.completed === 'false')) {
        filteredTodos = _.where(todos, {'completed': false});
    }

    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > 1;
        });
    }

    res.json(filteredTodos);
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
    const matchedTodo = _.findWhere(todos, {id: todoId});
    if (!matchedTodo) {
        return res.status(404).json({"error": " no todo found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
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