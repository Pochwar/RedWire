const winston = require('winston');
const nodemailer = require("nodemailer");
const uniqid = require('uniqid');
const UserModel = require('./../models/UserModel');


class MailService {

    constructor(conf) {
        this._conf = conf;
        this.smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: this._conf.site.smtp.mail,
                pass: this._conf.site.smtp.pass,
            },
        });


        this.idUnik = {};
        this.send = this.send.bind(this);
        this.verify = this.verify.bind(this);
    }

    send(host, to) {
        const rand = uniqid();

        this.idUnik[rand] = to;
        const link = "http://" + host + "/verify?id=" + rand + "&mail=" + to;
        let mail = '';
        mail = mail + 'Hello';
        mail += '<br>';
        mail += 'Please Click on the link to verify your email.';
        mail += '<br>';
        mail += '<a href="';
        mail += link;
        mail += '">';
        mail += 'Click here to verify';
        mail += '</a>';

        const mailOptions = {
            to: to,
            subject: "Please confirm your Email account",
            html: mail,
        }

        winston.info(this.mailOptions);
        const promesse = new Promise((function(resolve, reject) {
            this.smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            })
        }).bind(this));
        return promesse;
    }


    verify(mail, id) {
        const verif = new Promise((function(resolve, reject) {
            if (this.idUnik[id] && this.idUnik[id] == mail) {
                delete this.idUnik[id];
                const user = new UserModel();
                user.findByMail(mail)
                    .then(userToValid => {
                        return user.updateData(userToValid._id, "mailValid", true)
                    })
                    .then(function() {
                        resolve();
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            } else {
                reject('invalid code');
            }
        }).bind(this))
        return verif;
    }


}

module.exports = MailService;