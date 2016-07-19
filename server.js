const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const todoApiRoute = require('./routes/todoApiRoutes');
const userApiRoute = require('./routes/userApi');
const angularRoute = require('./routes/angularRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

todoApiRoute(app, db);
userApiRoute(app, db);
angularRoute(app);


db.sequelize.sync({force: false}).then(function () {

    app.listen(PORT, function () {
        console.log('Express listening on port: ' + PORT);
    });

});