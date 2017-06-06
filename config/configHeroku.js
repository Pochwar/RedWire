const CONF = {
    db: {
        username: CONF_MONGO_USER,
        password: CONF_MONGO_PASSWORD,
        host: CONF_MONGO_HOST,
        port: CONF_MONGO_PORT,
        base: CONF_MONGO_BASE,
    },
    server: {
        port: CONF_SERVER_PORT
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
            token: CONF_TVDB_TOKEN
        },
        tmdb: {
            token: CONF_TMDB_TOKEN
        }
    },
    faker: {
        quantity: 15
    },
};

module.exports = CONF;