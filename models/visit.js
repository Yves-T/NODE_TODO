module.exports = function (sequelize, DataTypes) {
    return sequelize.define('visit', {
        referingSite: {
            type: DataTypes.STRING
        },
        page: {
            type: DataTypes.STRING
        }
    });
};
