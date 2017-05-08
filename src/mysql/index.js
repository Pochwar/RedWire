import orm from 'orm';
import loadJsonFile  from 'load-json-file';
import path from 'path';

/*
 GET CONFIG
 */
const file = path.join(__dirname, '../../config/config.json');

loadJsonFile(file)
    .then(config => {
        orm.connect(`mysql://${config.db.mysql.user}:${config.db.mysql.pass}@${config.db.mysql.ip}/${config.db.mysql.base}`, (err, db) => {
            if (err) throw err;

            //load user model
            db.load("./../models/sql/user", (err) => {
                // loaded!
                // const Person = db.models.person;
                const User    = db.models.user;

                // add the table to the database
                db.sync((err) => {
                    if (err) throw err;

                    // add a row to the person table
                    User.create({
                            firstname: "John",
                            lastname: "Doe",
                            pseudo: "Jonnyy",
                            bDay: "1984/02/04",
                            mail: "j.doe@balek.com",
                            inscrDay: "2017/02/04",
                            pass: "azerty",
                            avatar: "http://www.minavatar.com/123.jpg",
                            ban: 0,
                            lanId: 0,
                            roleId: 3
                    },
                    err => {
                        if (err) throw err;

                        // query the person table by surname
                        User.find({ lastname: "Doe" }, (err, people)=> {
                            // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
                            if (err) throw err;

                            console.log("People found: %d", people.length);
                            console.log("First person: %s, age %d", people[0].fullName(), people[0].age);

                            people[0].age = 16;
                            people[0].save(function (err) {
                                // err.msg = "under-age";
                            });
                        });
                    });
                });
            });
        });
    })
    .catch(e => console.log(e))
;

