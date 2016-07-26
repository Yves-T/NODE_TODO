const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'local';
const config = require('./config');

var sequelize;
if (env === 'development') {
    sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
        host: 'localhost',
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }

    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.list = sequelize.import(__dirname + '/models/list.js');
db.visit = sequelize.import(__dirname + '/models/visit.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.todo.belongsTo(db.list);
db.list.hasMany(db.todo);
db.list.belongsTo(db.user);
db.user.hasMany(db.list);

module.exports = db;
