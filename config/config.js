const CONF = {
    db: {
        username: process.env.CONF_MONGO_USER,
        password: process.env.CONF_MONGO_PASSWORD,
        host: process.env.CONF_MONGO_HOST,
        port: process.env.CONF_MONGO_PORT,
        base: process.env.CONF_MONGO_BASE,
    },
    server: {
        port: process.env.CONF_SERVER_PORT,
    },
    site: {
        default: {
            ban: 0,
            role: 1,
            langId: 1,
            validatedSeries: 0,
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
    },
    API: {
        tmdb: {
            token: process.env.CONF_TMDB_TOKEN,
        }
    },
    faker: {
        quantity: 15,
    },
};

module.exports = CONF;
