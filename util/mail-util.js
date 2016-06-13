var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var transporter = nodemailer.createTransport(smtpTransport({
    host : "smtp.mailgun.org",
    secureConnection : false,
    port: 587,
    auth : {
        user : "postmaster@eya-apps.com",
        pass : "6df196b9fef61fa3d445f3601832cf08"
    }
}));
module.exports = transporter;