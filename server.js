const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
    const id = req.params.id;
    var filteredTodos = todos.filter(function (todo) {
        return todo.id == id;
    });

    if (filteredTodos.length > 0) {
        res.json(filteredTodos[0]);
    } else {
        return res.status(404).send();
    }
});

app.post('/todos', function (req, res) {
    const body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port: ' + PORT);
});
