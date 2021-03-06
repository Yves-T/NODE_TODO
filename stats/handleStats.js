const statUtil = require('./statUtils');
const visitorsData = {};
const db = require('../db');
const moment = require('moment');

module.exports = function (io, host) {
    io.on('connection', function (socket) {
        if (socket.handshake.headers.host === host
            && socket.handshake.headers.referer.indexOf(host + statUtil.config.dashboardEndpoint) > -1) {

            // if someone visits '/dashboard' send them the computed visitor data
            io.emit('updated-stats', statUtil.calculateStats(visitorsData));

        }

        // a user has visited our page - add them to the visitorsData object
        socket.on('visitor-data', function (data) {
            visitorsData[socket.id] = data;
            // remove older items
            db.visit.destroy({
                where: {
                    createdAt: {
                        $lt: moment().subtract(6, 'months').toDate()
                    }
                }
            })
                .then(() => db.visit.create({
                    referingSite: visitorsData[socket.id].referringSite,
                    page: visitorsData[socket.id].page,
                }))
                .catch((error)=> console.error(error));

            // compute and send visitor data to the dashboard when a new user visits our page
            io.emit('updated-stats', statUtil.calculateStats(visitorsData));
        });

        socket.on('disconnect', function () {
            // a user has left our page - remove them from the visitorsData object
            delete visitorsData[socket.id];

            // compute and send visitor data to the dashboard when a user leaves our page
            io.emit('updated-stats', statUtil.calculateStats(visitorsData));
        });
    });
};
