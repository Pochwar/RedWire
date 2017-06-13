const winston = require('winston');
const nodemailer = require("nodemailer");
const uniqid = require('uniqid');


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
        const link = "http://" + this.host + "/verify?id=" + this.rand;
        this.mailOptions.to = req.query.to;
        this.mailOptions.html = "<img src='img/logo.png'>Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>",

            winston.info(this.mailOptions);
        this.smtpTransport.sendMail(this.mailOptions, function(error, response) {
            if (error) {
                winston.info(error);
                res.end("error");
            } else {
                winston.info("Message sent: " + response.message);
                res.end("sent");
            }
        });
    }

    verify(req, res) {
        winston.info(req.protocol + ":/" + req.get('host'));
        if ((req.protocol + "://" + req.get('host')) == ("http://" + this.host)) {
            winston.info("Domain is matched. Information is from Authentic email");
            if (req.query.id == this.rand) {
                winston.info("email is verified");
                res.end("<h1>Email " + this.mailOptions.to + " is been Successfully verified");
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