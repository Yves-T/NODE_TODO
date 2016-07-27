const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const config = require('./../config');

const auth = {
    auth: {
        api_key: config.mailgun_api_key,
        domain: config.mailgun_domain
    }
};

const from = config.nodemail_from;

module.exports.sendResetMail = function (email, host, token, callback) {

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));

    nodemailerMailgun.sendMail({
        from,
        to: email,
        subject: 'Todo Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password' +
        ' for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + host + '/reset?token=' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }, (err) => {
        callback(err);
    });
};

module.exports.sendPasswordChangedMail = function (email, callback) {

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));

    nodemailerMailgun.sendMail({
        from,
        to: email,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
    }, (err) => {
        callback(err);
    });
};
