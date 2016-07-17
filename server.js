const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const todoApiRoute = require('./routes/todoApiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

todoApiRoute(app, db);


db.sequelize.sync().then(function () {

    app.listen(PORT, function () {
        console.log('Express listening on port: ' + PORT);
    });

});