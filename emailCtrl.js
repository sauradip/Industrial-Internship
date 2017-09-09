// **************** This Code is Created by Sauradip Nag ********************

// This is a Sample of Node.js Email Client using Node.js Code




var _ = require('lodash-node');
var fs = require('fs');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
var User = require('mongoose').model('User');

var envConfig = require(path.join(__dirname, '..', 'global', 'config', 'appConfig'));

var model = {
    verifyUrl: envConfig.Email_Verify,
    title: 'Cloud School Account Verfication',
    subTitle: 'Thanks for signing up!',
    body: 'Please verify your email address by clicking the button below'
}

exports.send = function (email, res) {
    var payload = {
        sub: email
    }
    
    var token = jwt.encode(payload, envConfig.EMAIL_SECRET);
    
    var transporter = nodemailer.createTransport({
        service: 'Gmail',            
        auth: {
            user: 'rishikesh.cloudschool@gmail.com',
            pass: envConfig.GMAIL_PASS
        }
    });
    
    var mailOptions = {
        to: email,
        subject: 'Cloud School Account Verification',
        html: getHtml(token)
    };
    
    
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) return res.status(500, err);
        
        console.log('email sent ', info.response);
    })
}

exports.handler = function (req, res) {
    var token = req.query.token;
    var payload = jwt.decode(token, envConfig.EMAIL_SECRET);
    var email = payload.sub;
    
    if (!email) return handleError(res);
    
    User.findOne({ username: email }).exec(function (err, foundUser) {
        if (err) return res.status(500);
        if (!foundUser) return handleError(res);
        
        if (!foundUser.active)
            foundUser.active = true;
        
        foundUser.save(function (err) {
            if (err) return res.status(500);
            
            return res.redirect(envConfig.Client_Domain);
        })
    });

}

function getHtml(token) {
    var path = './views/emailVerification.html';
    //TODO: make a synchronous call
    var html = fs.readFileSync(path, encoding = 'utf8');
    
    var template = _.template(html);
    model.verifyUrl += token;
    
    return template(model);
}

function handleError(res) {
    res.status(401);
    return res.send({
        message: 'Authentication failed, unable to verify email'
    });
}


_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};
