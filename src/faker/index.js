/*
 PACKAGES
 */
import FakeUser from './FakeUser';
import loadJsonFile  from 'load-json-file';
import path from 'path';
import Promise from 'bluebird';
import orm from 'orm';
import argparse from 'argparse';

/*
PARSE ARGUMENTS
 */
const ArgumentParser = argparse.ArgumentParser;
const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'Argparse example'
});
parser.addArgument(
    [ '-q', '--quantity' ],
    {
        help: 'quantity of fake users to create',
    }
);
parser.addArgument(
    [ '-t', '--type' ],
    {
        help: 'DB type (mysql or mongodb)',
    }
);
const args = parser.parseArgs();

/*
 GET CONFIG FILE
 */
const file = path.join(__dirname, '../../config/config.json');

/*
 BLUEBIRD PROMISES
 */
let promiseWhile = (condition, action) => {
    let resolver = Promise.defer();
    let loop = () => {
        if (!condition()) return resolver.resolve();
        return Promise.cast(action())
            .then(loop)
            .catch(resolver.reject);
    };
    process.nextTick(loop);
    return resolver.promise;
};

/*
 CREATE FAKE USERS
 */
//load configuration
loadJsonFile(file)
    .then(config => {

        let type = args.type;
        //if type argument is not passed or if it's not mongo or mysql, set the default value
        if (type !== "mongodb" && type !== "mysql"){
            console.log("db type null or not recognize, set to default")
            type = config.default.dbtype
        }
        //prepare connection
        let mydb;
        let msg;
        if (type === "mongodb"){
            //configuration for mongo
            mydb = `${config.db.mongodb.type}://${config.db.mongodb.ip}:${config.db.mongodb.port}/${config.db.mongodb.base}`;
            msg = `==Connected to ${config.db.mongodb.type} on ${config.db.mongodb.ip}:${config.db.mongodb.port}/${config.db.mongodb.base}==`;
        } else if (type === "mysql"){
            //configuration for mysql
            mydb = `${config.db.mysql.type}://${config.db.mysql.user}:${config.db.mysql.pass}@${config.db.mysql.ip}/${config.db.mysql.base}`;
            msg = `==Connected to ${config.db.mysql.type} on ${config.db.mysql.ip}:${config.db.mysql.port}/${config.db.mysql.base}==`;
        }



        //connection
        orm.connect(mydb, (err, db) => {
            if(err){
                console.log(err);
            } else {
                //display confirmation message
                console.log(msg);

                // load user model
                db.load(path.join(__dirname, '../models/users'), (err) => {
                    const User = db.models.users;

                    //Syncronise DB (add table in !exists)
                    db.sync((err) => {
                        if (err) throw err;

                        /*
                         Loop to generate fake users and save them to DB
                         */
                        //get quantity from passed arguments or default value from config
                        let quantity = parseInt(args.quantity);
                        if (isNaN(quantity)){
                            quantity = config.default.quantity;
                        }
                        let i = 1;
                        promiseWhile(
                            //condition
                            () => {
                                return i <= quantity
                            },
                            //action
                            () => {
                                return new Promise((resolve, reject) => {
                                    //create fakeUser
                                    const fakeUser = new FakeUser();
                                    //encrypt password
                                    fakeUser.passwordEncrypt
                                        .then(hashPass => {
                                            //save user
                                            User.create({
                                                    firstname: fakeUser.firstname,
                                                    lastname: fakeUser.lastname,
                                                    pseudo: fakeUser.pseudo,
                                                    bDay: fakeUser.bDay,
                                                    mail: fakeUser.mail,
                                                    inscrDay: fakeUser.inscrDay,
                                                    pass: hashPass,
                                                    avatar: fakeUser.avatar,
                                                    ban: fakeUser.ban,
                                                    lanId: fakeUser.lanId,
                                                    roleId: fakeUser.roleId
                                                },
                                                err => {
                                                    if (err) throw err;
                                                    //display confirmation message
                                                    console.log(`User ${fakeUser.firstname} created !!`)
                                                }
                                            );
                                        })
                                    ;
                                    i++;
                                    resolve();
                                }); //end of user create Promise
                            } //end of promiseWhile action
                        ); //end of promiseWhile
                    }); //end of syncronisation
                }); //end of userModel load
            } //end of successful connection
        }); //end of orm connect
    }) //end of config load
    .catch(e => console.log(e))
;
