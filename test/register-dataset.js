module.exports = {
    "route": {
        "name": "Registration route",
        "path": "/register",
        "verb": "post"
    },
    "dataset": [
        {
            "name": "valid form",
            "status": 200,
            "data": {
                "firstname": "toto",
                "lastname": "toto",
                "pseudo": "toto",
                "birthday": "02/06/2017",
                "email": "toto@mail.com",
                "password": "toto",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
        {
            "name": "empty form",
            "status": 500,
            "data": {
            }
        },
        {
            "name": "invalid email",
            "status": 500,
            "data": {
                "firstname": "toto",
                "firstname": "toto",
                "lastname": "toto",
                "pseudo": "toto",
                "birthday": "02/06/2017",
                "email": "totail.com",
                "password": "toto",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
        {
            "name": "invalid birthday",
            "status": 500,
            "data": {
                "firstname": "toto",
                "lastname": "toto",
                "pseudo": "toto",
                "birthday": "02/067",
                "email": "toto@mail.com",
                "password": "toto",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
        {
            "name": "invalid firstname",
            "status": 500,
            "data": {
                "firstname": "t!lk-5er",
                "lastname": "toto",
                "pseudo": "toto",
                "birthday": "02/06/2017",
                "email": "toto@mail.com",
                "password": "toto",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
        {
            "name": "invalid lastname",
            "status": 500,
            "data": {
                "firstname": "toto",
                "lastname": "(tr(-5))",
                "pseudo": "toto",
                "birthday": "02/06/2017",
                "email": "toto@mail.com",
                "password": "toto",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
        {
            "name": "invalid pseudo",
            "status": 500,
            "data": {
                "firstname": "toto",
                "lastname": "toto",
                "pseudo": "3/!:fgf",
                "birthday": "02/06/2017",
                "email": "toto@mail.com",
                "password": "toto",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
         {
            "name": "invalid password",
            "status": 500,
            "data": {
                "firstname": "toto",
                "lastname": "toto",
                "pseudo": "3/!:fgf",
                "birthday": "02/06/2017",
                "email": "toto@mail.com",
                "password": "tot-3!:d/o",
                "passwordConf": "toto",
                "langId": "1"
            }
        },
    ]
}