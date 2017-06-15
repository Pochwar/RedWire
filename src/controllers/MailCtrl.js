const winston = require('winston');
const nodemailer = require("nodemailer");
const uniqid = require('uniqid');
const UserModel = require('./../models/UserModel');


class MailCtrl {

    constructor(conf) {
        this._conf = conf;
        this.smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: this._conf.site.smtp.mail,
                pass: this._conf.site.smtp.pass,
            },
        });

        this.mailOptions = {
            to: "",
            subject: "Please confirm your Email account",
            html: "",
        }
        this.rand = uniqid();
        this.host = "";
    }

    send(req, res) {
        this.host = req.get('host');
        this.mailOptions.to = req.query.to;
        const link = "http://" + this.host + "/verify?id=" + this.rand + "&mail=" + req.query.to;
        this.mailOptions.html = "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>",

            winston.info(this.mailOptions);
        this.smtpTransport.sendMail(this.mailOptions, function(error, response) {
            if (error) {
                winston.info(error);
                res.render('registration.twig', {
                    error: res.__('MAIL_SENT_ERROR'),
                });
            } else {
                winston.info("Message sent: " + response.message);
                res.render('registration.twig', {
                    msg: res.__('MAIL_SENT'),
                });
            }
        })
    }


    verify(req, res) {
        this.host = req.get('host');
        winston.info(req.protocol + ":/" + this.host);
        if ((req.protocol + "://" + this.host) == ("http://" + this.host)) {
            winston.info("Domain is matched. Information is from Authentic email");
            if (req.query.id == this.rand) {
                winston.info("email is verified");
                const user = new UserModel();
                user.findByMail(req.query.mail)
                    .then(userToValid => {
                        user.updateData(userToValid._id, "mailValid", true)
                            .then((msg) => {
                                winston.info(msg);
                                res.end("<h1>Email " + this.mailOptions.to + " is been Successfully verified");
                            })
                            .catch((err) => {
                                winston.info(err)
                                res.end("Problem when activating your account")
                            });
                    })
                    .catch((e) => winston.info(e));
            } else {
                winston.info("email is not verified");
                res.end("<h1>Bad Request</h1>");
            }
        } else {
            res.end("<h1>Request is from unknown source");
        }
    }
}

module.exports = MailCtrl;