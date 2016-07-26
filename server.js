const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const todoApiRoute = require('./routes/todoApiRoutes');
const userApiRoute = require('./routes/userApi');
const listApiRoute = require('./routes/listApi');
const statRoute = require('./routes/statRoute');
const angularRoute = require('./routes/angularRoute');

const handleStats = require('./stats/handleStats');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost:' + PORT;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

todoApiRoute(app, db);
userApiRoute(app, db);
listApiRoute(app, db);
statRoute(app);
angularRoute(app);

handleStats(io, HOST);

db.sequelize.sync({force: false}).then(function () {

    http.listen(PORT, function () {
        console.log('Express listening on port: ' + PORT);
    });

});