const CONF = {
    db: {
        username: process.env.CONF_MONGO_USER,
        password: process.env.CONF_MONGO_PASSWORD,
        host: process.env.CONF_MONGO_HOST,
        port: process.env.CONF_MONGO_PORT,
        base: process.env.CONF_MONGO_BASE,
    },
    server: {
        port: process.env.PORT
    },
    site: {
        default: {
            ban: 0,
            role: 1,
        },
        roles: {
            user: 1,
            moderator: 2,
            superadmin: 3,
        }
    },
    API: {
        tvdb: {
            token: process.env.CONF_TVDB_TOKEN
        },
        tmdb: {
            token: process.env.CONF_TMDB_TOKEN
        }
    },
    faker: {
        quantity: 15
    },
};

module.exports = CONF;
