module.exports = function (sequelize, DataTypes) {
    return sequelize.define('list', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        }
    });
};
