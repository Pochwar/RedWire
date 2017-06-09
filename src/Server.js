/*
 IMPORT PACKAGES
 */
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const winston = require('winston');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// middleware
const AccessGranted = require('./middleware/AccessGranted');
const ExtractUser = require('./middleware/ExtractUser');

// controllers
const RegistrationCtrl = require('./controllers/RegistrationCtrl');
const LoginCtrl = require('./controllers/LoginCtrl');
const SeriesCtrl = require('./controllers/SeriesCtrl');
const AdminHomeCtrl = require('./controllers/AdminHomeCtrl');
const UnauthorizedCtrl = require('./controllers/UnauthorizedCtrl');
const IndexCtrl = require('./controllers/IndexCtrl');
const LangCtrl = require('./controllers/LangCtrl');
const ChatCtrl = require('./controllers/ChatCtrl');
const ContributeCtrl = require('./controllers/ContributeCtrl');
const ProfileCtrl = require('./controllers/ProfileCtrl');

// models
const SerieModel = require("./models/SerieModel");

// services
const TokenService = require('./services/token.js');
const LangService = require('./services/LangService');

//chat
const Chat = require('./services/Chat');

class Server {
    constructor(conf) {

        this._conf = conf;

        //set express server
        this._app = express();

        //set http server (for the chat)
        this._server = http.createServer(this._app);

        //set public path
        this._app.use(express.static(path.join(__dirname, '/../public')));

        //use body parser
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({
            extended: true,
        }));

        //use file upload
        this._app.use(fileUpload());

        // save config in app
        this._app.set('conf', conf);

        //configure i18n
        i18n.configure({
            locales: ['fr', 'en',],

            defaultLocale: 'fr',
            directory: path.join(__dirname, '/../locales'),
            cookie: this._conf.site.cookies.i18nName,
        });

        // init services
        const tokenService = new TokenService(this._conf.site.hash.token);
        this._app.set('tokenService', tokenService);

        const langService = new LangService(this._conf);
        this._app.set('langService', langService);

        //use cookie
        this._app.use(cookieParser());

        //use i18n
        this._app.use(i18n.init);

        // extract user from cookies to res.locals.user
        this._app.use(ExtractUser.fromCookies);

        // check that user's lang is correctly setted
        this._app.use(langService.checkCookies);

        //chat
        const chat = new Chat(this._server);
    }

    run() {
        this._setRoutes();

        this._server.listen(this._conf.server.port, () => winston.info(`### Server listening on localhost:${this._conf.server.port} ###`));
    }

    _setRoutes() {

        /*
        INIT CONTROLLERS
         */

        const registrationCtrl = new RegistrationCtrl(this._conf);
        const loginCtrl = new LoginCtrl();
        const serieModel = new SerieModel();
        const seriesCtrl = new SeriesCtrl(serieModel);
        const adminHomeCtrl = new AdminHomeCtrl();
        const indexCtrl = new IndexCtrl();
        const langCtrl = new LangCtrl(this._conf);
        const chatCtrl = new ChatCtrl();
        const contributeCtrl = new ContributeCtrl();
        const profileCtrl = new ProfileCtrl();
        
        // init access control
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

        // routing exemple for series (everyone can access)
        this._app.get('/series', accessGranted.everyone, seriesCtrl.get);

        /*  examples for admin
            this._app.get('/admin', accessGranted.moderator, adminCtrl.get);
            
            example for everyone (non logged)
            this._app.get('/admin', accessGranted.everyone, indexCtrl.get);

            example for super admin
            this._app.get('/admin', accessGranted.superAdmin, superAdminCtrl.get);

            example for members (logged)
            this._app.get('/admin', accessGranted.member, adminCtrl.get);
        */

        /*
        SET ROUTES
        * /site routing is managed by siteRouter
        */

        this._app.get('/', accessGranted.everyone, indexCtrl.get);

        this._app.get('/home', accessGranted.member, IndexCtrl.indexLoggedAction);


        //registration page
        this._app.get('/register', registrationCtrl.get);
        this._app.post('/register', registrationCtrl.post);

        //login
        this._app.post('/login', loginCtrl.post);

        //admin home
        this._app.get('/admin', accessGranted.moderator, adminHomeCtrl.get);

        //chat
        this._app.get('/chat', accessGranted.member, chatCtrl.get);
        //trick to get user pseudo client side
        this._app.get('/api/user/data', (req, res) => {
            const UserModel = require('./models/UserModel');
            const tokenService = req.app.get('tokenService');
            const data = tokenService.extractData( req.cookies[this._conf.site.cookies.tokenName]);
            UserModel.findById( data.id )
                .then( user => {
                    if (user === undefined) {
                        // The user is not logged in
                        res.json({});
                    } else {
                        res.json({
                            username: user.pseudo
                        });
                    }
                })
                .catch( err => {
                    winston.info('info', 'ExtractUser.fromcookies - model extraction: ' + err.message);
                    next();
                });


        });

        //contribute
        this._app.post('/contribute', accessGranted.member, contributeCtrl.post);

        //profile
        this._app.get('/profile', accessGranted.member, profileCtrl.get);

        //logout
        this._app.get('/logout', (req, res) => {

            res.cookie(this._conf.site.cookies.i18nName, 'deleted', {
                maxAge: 0,
                httpOnly: true,
            });

            res.cookie(this._conf.site.cookies.tokenName, 'deleted', {
                maxAge: 0,
                httpOnly: true,

            });

            // destroy cookie
            res.redirect('/');
        });

        this._app.get('/unauthorized', UnauthorizedCtrl.indexAction);

        //locales
        this._app.get('/lang/:lang', langCtrl.changeLang.bind(langCtrl));

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
