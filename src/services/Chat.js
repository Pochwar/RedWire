const socket = require('socket.io');
const uniqid = require('uniqid');
const winston = require('winston');

class Chat {
    constructor(server) {
        this._server = server;

        // socket.io
        const io = socket.listen(this._server);

        const users = [];

        io.on('connection', socket => {
            socket.on('newUser', pseudo => {

                if (pseudo === null || pseudo === ""){pseudo = `Anon${uniqid()}`}
                socket.pseudo = pseudo;
                socket.emit('info', `Bienvenue ${socket.pseudo}`);
                socket.broadcast.emit('info', {
                    pseudo: socket.pseudo,
                    action: 'CONNECT'
                });
                users.push(socket.pseudo);
                io.emit('users', users);
                winston.info('info', `CHAT - connection - New user : ${socket.pseudo}`);
            });

            socket.on('msg', msg => {
                socket.emit('selfMsg', msg);
                socket.broadcast.emit('userMsg', {
                    msg : msg,
                    pseudo : socket.pseudo
                });
                winston.info('info', `CHAT - msg - ${socket.pseudo} says : ${msg}`);
            });

            socket.on('typing', msg => {
                socket.broadcast.emit('info', {
                    pseudo: socket.pseudo,
                    action: 'ISWRITING'
                });
            });

            socket.on('disconnect', () => {
                socket.broadcast.emit('info', {
                    pseudo: socket.pseudo,
                    action: 'DISCONNECT'
                });
                let index = users.indexOf(socket.pseudo);
                if(index !== -1){
                    users.splice(index, 1);
                }
                io.emit('users', users);
                winston.info('info', `CHAT - disconnect -${socket.pseudo} disconnected`)
            });

        });

    }


}

module.exports = Chat;
