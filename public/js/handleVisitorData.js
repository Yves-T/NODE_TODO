var socket = io();
var visitorData = {
    referringSite: document.referrer,
    page: location.pathname
};
socket.emit('visitor-data', visitorData);
