/*
 IMPORT PACKAGES
 */
const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const winston = require('winston');
const bodyParser = require('body-parser');
const session = require('express-session')

// middleware
const AccessGranted = require('./middleware/AccessGranted');
const ExtractUser = require('./middleware/ExtractUser');
const ParseQuery = require('./middleware/ParseQuery');

// controllers
const RegistrationCtrl = require('./controllers/RegistrationCtrl');
const LoginCtrl = require('./controllers/LoginCtrl');
const SeriesCtrl = require('./controllers/SeriesCtrl');
const AdminHomeCtrl = require('./controllers/AdminHomeCtrl');
const UnauthorizedCtrl = require('./controllers/UnauthorizedCtrl');
const IndexCtrl = require('./controllers/IndexCtrl');
const LangCtrl = require('./controllers/LangCtrl');
const ChatCtrl = require('./controllers/ChatCtrl');
const SearchCtrl = require('./controllers/SearchCtrl');
const UserCtrl = require('./controllers/UserCtrl');
const MailCtrl = require('./controllers/MailCtrl');
// models
const SerieModel = require("./models/SerieModel");

// services
const TokenService = require('./services/token.js');
const LangService = require('./services/LangService');
const TmdbService = require('./services/TmdbService');
const UserInfoVerificationService = require('./services/UserInfoVerificationService');
const Chat = require('./services/Chat');
const Multer = require('./services/Multer');

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

        //Multer file upload
        this.upload = new Multer(this._conf);

        //use flash
        this._app.use(session({
            secret: 'fishbluck',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
        }));
        this._app.use(require('flash')());

        // save config in app
        this._app.set('conf', conf);

        //configure i18n
        i18n.configure({
            locales: ['fr', 'en', ],

            defaultLocale: 'fr',
            directory: path.join(__dirname, '/../locales'),
            cookie: this._conf.site.cookies.i18nName,
        });

        // init services
        const tokenService = new TokenService(this._conf.site.hash.token);
        this._app.set('tokenService', tokenService);

        const langService = new LangService(this._conf);
        this._app.set('langService', langService);

        const tmdbService = new TmdbService(this._conf.API.tmdb.token);
        this._app.set('tmdbService', tmdbService);

        const UIV = new UserInfoVerificationService(this._conf);
        this._app.set('UIV', UIV);

        const chat = new Chat(this._server);

        //use cookie
        this._app.use(cookieParser());

        //use i18n
        this._app.use(i18n.init);

        // extract user from cookies to res.locals.user
        this._app.use(ExtractUser.fromCookies);

        // check that user's lang is correctly setted
        this._app.use(langService.checkCookies);

        // parse query
        this._app.use(ParseQuery.toLocals);

        //chat
        new Chat(this._server);
    }

    run() {
        this._setRoutes();

        this._server.listen(this._conf.server.port, () => winston.info(`### Server listening on localhost:${this._conf.server.port} ###`));
    }

    _setRoutes() {

        // init models
        const serieModel = new SerieModel(
            this._conf.site.default.resultPerPage,
            this._conf.site.default.posterPath,
            this._conf.API.tmdb.posterPath);

        /*
        INIT CONTROLLERS
         */

        const registrationCtrl = new RegistrationCtrl(this._conf);
        const loginCtrl = new LoginCtrl();
        const seriesCtrl = new SeriesCtrl(serieModel);
        const adminHomeCtrl = new AdminHomeCtrl();
        const indexCtrl = new IndexCtrl();
        const langCtrl = new LangCtrl(this._conf);
        const chatCtrl = new ChatCtrl();
        const searchCtrl = new SearchCtrl(serieModel);
        const userCtrl = new UserCtrl(this._conf);
        const mailCtrl = new MailCtrl(this._conf);

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


        // send a verification mail
        this._app.get('/send', accessGranted.everyone, mailCtrl.send.bind(mailCtrl));

        // verify a mail
        this._app.get('/verify', accessGranted.everyone, mailCtrl.verify);

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
        // get all series from DB
        this._app.get('/series', accessGranted.everyone, seriesCtrl.get);

        // get the serie's creation form
        this._app.get('/series/add', accessGranted.member, seriesCtrl.getForm);

        // post the form results for creating a serie
        this._app.post('/series/add', accessGranted.member, seriesCtrl.post);

        //get one serie from its id
        this._app.get('/series/:id', accessGranted.everyone, seriesCtrl.getById);

        //follow
        this._app.put('/series/:id/follow', accessGranted.member, seriesCtrl.putUserFollow);

        //update
        this._app.get('/series/:id/update', accessGranted.member,seriesCtrl.getModify);
        this._app.post('/series/:id/update', accessGranted.member, seriesCtrl.post);

        // get one episode from its id
        this._app.get('/episode/:id', accessGranted.everyone, seriesCtrl.getEpisodeById);

        this._app.get('/', accessGranted.everyone, indexCtrl.get);

        this._app.get('/home', accessGranted.member, IndexCtrl.indexLoggedAction);

        // search
        this._app.get('/search', accessGranted.everyone, searchCtrl.byTitle);
        this._app.get('/search/title', accessGranted.everyone, searchCtrl.byTitle);
        this._app.get('/search/actor', accessGranted.everyone, searchCtrl.byActor);

        //trick to get user information client side
        this._app.get('/api/user/data', (req, res) => {
            if (res.locals.user) {
                res.json({
                    pseudo: res.locals.user.pseudo,
                    birthday: res.locals.user.birthday,
                    locale: res.locals.locale
                })
            } else {
                res.json({
                    locale: res.locals.locale
                })
            }
        });

        //registration page
        this._app.get('/register', accessGranted.everyone, registrationCtrl.get);
        this._app.post('/register', accessGranted.everyone, registrationCtrl.post);

        //login
        this._app.post('/login', accessGranted.everyone, loginCtrl.post);

        //admin home
        this._app.get('/admin', accessGranted.moderator, adminHomeCtrl.get);

        //chat
        this._app.get('/chat', accessGranted.member, chatCtrl.get);

        //user
        this._app.get('/wall', accessGranted.member, userCtrl.getWall);
        this._app.get('/user', accessGranted.member, userCtrl.getUserInfo.bind(userCtrl));
        this._app.post('/user', this.upload.single('avatar'), accessGranted.member, userCtrl.putUserInfo.bind(userCtrl));


        //logout
        this._app.get('/logout', accessGranted.member, (req, res) => {

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
        this._app.get('/lang/:lang', accessGranted.everyone, langCtrl.changeLang.bind(langCtrl));

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