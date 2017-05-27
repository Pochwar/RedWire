/*
 IMPORT PACKAGES
 */
import CONF from './../config/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import IndexCtrl from './controllers/IndexCtrl'
import RegistrationCtrl from './controllers/RegistrationCtrl'

export default class Server {
    constructor() {
        //set express server
        this._app = express();

        //set public path
        this._app.use(express.static(path.join(__dirname, '/../public')));

        // Use the session middleware
        this.sessParam = {
            secret:'secret',
            cookie: {
                maxAge: 60000
            }
        };
        this._app.use(session(this.sessParam));
    }

    run(port) {
        this._setRoutes();

        this._app.listen(port, () => console.log(`Server listening on port ${port}`));
    }

    _setRoutes() {
        /*
        INIT CONTROLLERS
         */

        const indexCtrl = new IndexCtrl(CONF.siteInfo.title);
        const registrationCtrl = new RegistrationCtrl(CONF.siteInfo.title);
        // const loginCtrl = new LoginCtrl(this.title);

        /*
         SET ROUTES
         */

        //home
        this._app.get('/', indexCtrl.get.bind(indexCtrl));

        //registration page
        this._app.get('/register', registrationCtrl.get.bind(registrationCtrl));
        this._app.post('/register', registrationCtrl.post);

        //login
        // this._app.get('/login', loginCtrl.index.bind(loginCtrl));
        // this._app.post('/login', loginCtrl.form);

        //logout
        this._app.get('/logout', (req, res) => {
            //destroy session
            req.session.destroy();
            res.redirect('/');
        });

        //404
        this._app.use((req, res, next) => {
            res.status(404);
            res.render('404.twig', {
                url: req.url
            })
        })
    }
}