const _ = require('underscore');
const bcrypt = require('bcrypt');
const cryptjs = require('crypto-js');
const jwt = require('jsonwebtoken');
const config = require('../config');

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
            },
            generateToken: function (type) {
                if (!_.isString(type)) {
                    return undefined;
                }

                try {
                    const stringData = JSON.stringify({id: this.get('id'), type: type});
                    const encryptedData = cryptjs.AES.encrypt(stringData, config.cryptoSecret).toString();
                    return jwt.sign({
                        token: encryptedData
                    }, config.jwtSecret);
                } catch (error) {
                    return undefined;
                }

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
