const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const todoApiRoute = require('./routes/todoApiRoutes');
const userApiRoute = require('./routes/userApi');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

todoApiRoute(app, db);
userApiRoute(app, db);


db.sequelize.sync({force:true}).then(function () {

    app.listen(PORT, function () {
        console.log('Express listening on port: ' + PORT);
    });

});