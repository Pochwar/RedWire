/*
 IMPORT PACKAGES
 */

const express = require('express');
const path = require( 'path');
const session = require( 'express-session');
const cookieParser = require( 'cookie-parser');
const i18n = require( 'i18n');
const winston = require('winston');
const bodyParser = require( 'body-parser');

// middleware
const AccessGranted = require('./middleware/AccessGranted');

// routers
const unauthorizedRouter = require('./routers/unauthorizedRouter');

// controllers
const IndexCtrl = require( './controllers/IndexCtrl');
const RegistrationCtrl = require( './controllers/RegistrationCtrl');
const LoginCtrl = require( './controllers/LoginCtrl');
const SeriesCtrl = require( './controllers/SeriesCtrl');
const AdminHomeCtrl = require( './controllers/AdminHomeCtrl');

class Server {
    constructor( conf) {

        this._conf = conf;

        //set express server
        this._app = express();

        //set public path
        this._app.use(express.static(path.join(__dirname, '/../public')));

        //use body parser
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({
            extended: true,
        }));

        //configure i18n
        i18n.configure({
            locales:['fr', 'en',],
            defaultLocale: 'fr',
            directory: path.join(__dirname, '/../locales'),
            cookie: 'i18n',
        });

        //use cookie
        this._app.use(cookieParser('i18n_fishblock'));

        //use session
        this._app.use(session({
            secret: 'i18n_fishblock',
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: 3600000,},
        }));

        //use i18n
        this._app.use(i18n.init);
    }

    run() {
        this._setRoutes();

        this._app.listen(this._conf.server.port, () => winston.info(`### Server listening on localhost:${this._conf.server.port} ###`));
    }

    _setRoutes() {
        /*
        INIT CONTROLLERS
         */

        const indexCtrl = new IndexCtrl();
        const registrationCtrl = new RegistrationCtrl(this._conf);
        const loginCtrl = new LoginCtrl();
        const seriesCtrl = new SeriesCtrl();
        const adminHomeCtrl = new AdminHomeCtrl();

        /*
        * Role checking
        * Only connected users can access /site/
        * Only moderators / admin can access /admin
        * Only super admin can caccess /admin/moderators
        */
        const accessGranted = new AccessGranted(
            this._conf.site.roles.user,
            this._conf.site.roles.moderator,
            this._conf.site.roles.superadmin
        );

        // Pour le test
        this._app.all('/series*', accessGranted.toSite);

        this._app.all('/site*', accessGranted.toSite);
        this._app.all('/admin*', accessGranted.toAdmin);
        this._app.all('/admin/moderators*', accessGranted.toSuperAdmin);

        /*
         SET ROUTES
         */
        
        
        //home
        this._app.get('/', indexCtrl.get);

        //registration page
        this._app.get('/register', registrationCtrl.get);
        this._app.post('/register', registrationCtrl.post);

        //login
        this._app.get('/login', loginCtrl.get);
        this._app.post('/login', loginCtrl.post);

        //series
        this._app.get('/series', seriesCtrl.get);

        //admin home
        this._app.get('/admin', adminHomeCtrl.get);

        //logout
        this._app.get('/logout', (req, res) => {
            //destroy session
            req.session.destroy();
            res.redirect('/');
        });

        // authentification failure (using router)
        this._app.use('/unauthorized', unauthorizedRouter);

        //locales
        this._app.get('/fr', (req, res) => {
            res.cookie('i18n', 'fr');
            res.redirect('/')
        });
        this._app.get('/en', (req, res) => {
            res.cookie('i18n', 'en');
            res.redirect('/')
        });

        //404
        this._app.use((req, res) => {
            res.status(404);
            res.render('404.twig', {
                url: req.url,
            })
        })
    }
}

module.exports = Server;
