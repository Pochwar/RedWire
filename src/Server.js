/*
 IMPORT PACKAGES
 */
import CONF from './../config/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import IndexCtrl from './controllers/IndexCtrl'
import RegistrationCtrl from './controllers/RegistrationCtrl'
import i18n from 'i18n';

export default class Server {
    constructor() {
        //set express server
        this._app = express();

        //set public path
        this._app.use(express.static(path.join(__dirname, '/../public')));

        //configure i18n
        i18n.configure({
            locales:['fr', 'en'],
            defaultLocale: 'fr',
            directory: path.join(__dirname, '/../locales'),
            cookie: 'i18n'
        });

        //use cookie
        this._app.use(cookieParser('i18n_fishblock'));

        //use session
        this._app.use(session({
            secret: 'i18n_fishblock',
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: 60000 }
        }));

        //use i18n
        this._app.use(i18n.init);
    }

    run(port) {
        this._setRoutes();

        this._app.listen(port, () => console.log(`Server listening on port ${port}`));
    }

    _setRoutes() {
        /*
        INIT CONTROLLERS
         */

        const indexCtrl = new IndexCtrl();
        const registrationCtrl = new RegistrationCtrl();
        // const loginCtrl = new LoginCtrl();

        /*
         SET ROUTES
         */

        //home
        this._app.get('/', indexCtrl.get);

        //registration page
        this._app.get('/register', registrationCtrl.get);
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

        //locales
        this._app.get('/fr', function (req, res) {
            res.cookie('i18n', 'fr');
            res.redirect('/')
        });
        this._app.get('/en', function (req, res) {
            res.cookie('i18n', 'en');
            res.redirect('/')
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