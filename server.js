const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const todos = [
    {
        description: 'Meet mom for lunch',
        completed: false,
        id: 1
    },
    {
        description: 'Go to market',
        completed: false,
        id: 2
    },
    {
        description: 'Another task',
        completed: true,
        id: 3
    }
];

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

app.listen(PORT, function () {
    console.log('Express listening on port: ' + PORT);
});
