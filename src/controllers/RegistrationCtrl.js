import mongoose from 'mongoose';
import encrypt from 'bcrypt';
import _ from 'underscore';

mongoose.Promise = global.Promise;

export default class RegistrationCtrl {
    constructor(title){
        this.title = title;
    }

    get(req, res){
        let msg = "";
        if (!_.isEmpty(req.param("msg"))) {
            msg = req.param("msg");
        }
        res.render('registration.twig', {
            title: `${this.title} - Register`,
            msg: msg
        })
    }


    post(req, res){
        // if (!_.isEmpty(req.body.pseudo) && !_.isEmpty(req.body.pass) && !_.isEmpty(req.body.passConf)) {
        //     if (req.body.pass === req.body.passConf) {
        //         //enregistrement dans la bdd
        //         if (mongoose.connection._readyState === 1) {
        //             const user = new AppUser();
        //             //ENCRYPTION
        //             const saltRounds = 10;
        //             encrypt.hash(req.body.pass, saltRounds, (err, hash) => {
        //                 user.registerInDb(req.body.pseudo, hash);
        //                 res.redirect('/registration?msg=ok');
        //             })
        //         } else {
        //             res.redirect('/registration?msg=connect');
        //         }
        //     } else {
        //         res.redirect('/registration?msg=pass');
        //     }
        // } else {
        //     res.redirect('/registration?msg=empty');
        // }

    }

}
