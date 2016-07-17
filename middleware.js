module.exports = function (db) {
    return {
        requireAuthentication: (req, res, next) => {
            const token = req.get('Auth');

            db.user.findByToken(token).then((user) => {
                req.user = user;
                next();
            }, () => res.status(401).send());
        }
    };
};