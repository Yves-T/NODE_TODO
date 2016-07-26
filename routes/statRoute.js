module.exports = function (app) {
    app.get('/dashboard', function (req, res) {
        res.sendfile('./public/dashboard.html');
    });
};
