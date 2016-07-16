const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

const app = express();
const PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    const todoId = parseInt(req.params.id, 10);

    const matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        return res.status(404).send();
    }
});

app.post('/todos', function (req, res) {
    var body = req.body;

    body = _.pick(body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || _.isString(!body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }


    body.description = body.description.trim();


    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
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

app.listen(PORT, function () {
    console.log('Express listening on port: ' + PORT);
});
