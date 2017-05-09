module.exports = function (db, cb) {
    db.define('users', {
        id: {
            type: 'serial',
            key: true
        },
        firstname: {
            type: "text",
            size: 50,
            required: true,
        },
        lastname: {
            type: "text",
            size: 50,
            required: true,
        },
        pseudo: {
            type: "text",
            size: 50,
            unique: true,
            required: true,
        },
        bDay: {
            type: "date",
            required: true,
        },
        mail: {
            type: "text",
            unique: true,
            required: true,
        },
        inscrDay: {
            type: "date",
            required: true,
        },
        pass: {
            type: "text",
            required: true,
        },
        avatar: {
            type: "text",
        },
        ban: {
            type: "boolean",
            required: true,
        },
        lanId: {
            type: "integer",
            required: true,
        },
        roleId: {
            type: "integer",
            required: true,
        },
    }, {
        methods : {
            fullName: function() {
                return this.firstname + ' ' + this.lastname;
            }
        }
    });

    return cb();
};