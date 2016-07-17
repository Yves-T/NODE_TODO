const _ = require('underscore');
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: (user, options) => {
                if (_.isString(user.email)) {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                // remove password data from json response
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
            }
        },
        classMethods: {
            authenticate: function (body) {
                return new Promise((resolve, reject) => {

                    if (!_.isString(body.email) || !_.isString(body.password)) {
                        return reject();
                    }

                    user.findOne({where: {email: body.email}}).then((user) => {
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            return reject();
                        } else {
                            return resolve(user);
                        }

                    }, (error) => {
                        reject();
                    });
                });
            }
        }
    });

    return user;
};
