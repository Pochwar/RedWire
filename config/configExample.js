const CONF = {
    db: {
        username: "username",
        password: "password",
        host: "host",
        port: "port",
        base: "base",
    },
    server: {
        port: "port"
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
            token: 'token'
        },
        tmdb: {
            token: 'token'
        }
    },
    faker: {
        quantity: 15
    },
};

module.exports = CONF;
