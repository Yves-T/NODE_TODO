const statUtil = require('./statUtils');
var visitorsData = {};

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
