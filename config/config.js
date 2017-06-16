const CONF = {
    db: {
        username: process.env.CONF_MONGO_USER,
        password: process.env.CONF_MONGO_PASSWORD,
        host: process.env.CONF_MONGO_HOST,
        port: process.env.CONF_MONGO_PORT,
        base: process.env.CONF_MONGO_BASE,
    },
    server: {
        port: process.env.PORT,
    },
    site: {
        default: {
            ban: 0,
            role: 1,
            langId: 1,
            validatedSeries: 0,
            posterPath: process.env.CONF_SITE_POSTERPATH,
            avatarPath: process.env.CONF_SITE_AVATARPATH,
            resultPerPage: 10,
            poster: '/img/poster-default.png',
            ageMax : 31556952000 * 13, //13 years,
            contact: process.env.CONF_MAIL_CONTACT,
        },
        roles: {
            user: 1,
            moderator: 2,
            superadmin: 3,
        },
        hash: {
            token: process.env.CONF_JWT_HASH,
        },
        cookies: {
            i18nName: 'fishblock_i18n',
            tokenName: 'fishblock_token',
            maxAge: 1000 * 3600 * 60 * 24 * 30,
        },
        lang: {
            1: "fr",
            2: "en",
        },
        smtp: {
            mail: process.env.CONF_SMTP_MAIL,
            pass: process.env.CONF_SMTP_PASS,
        },
        image: {
            authExt: ['.jpg', '.jpeg', '.gif', '.png'],
            maxSize: "1mb"
        },
        authErrMsg: {
            userMod: ['UIM_noChange', 'UIM_dbError', 'UIM_passNoMatch', 'UIM_passAlphaNumError', 'UIM_passError', 'UIM_passChangeOk', 'UIM_avatarChangeOk', 'UIM_avatarDeletetionError', 'UIM_avatarDeleted', 'UIM_birthdayError', 'UIM_birthdayChangeOk', 'UIM_langIdError', 'UIM_langIdChangeOk', 'UIM_mailError', 'UIM_mailChangeOk', 'UIM_firstnameAlphaNumError', 'UIM_firstnameChangeOk', 'UIM_lastnameAlphaNumError', 'UIM_lastnameChangeOk', 'UIM_pseudoAlphaNumError', 'UIM_pseudoChangeOk'],
        }
    },
    API: {
        tmdb: {
            token: process.env.CONF_TMDB_TOKEN,
            posterPath: process.env.CONF_TMDB_POSTERPATH,
        }
    },
    faker: {
        quantity: 15,
    },
};

module.exports = CONF;