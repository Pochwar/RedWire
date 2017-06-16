const jwt = require('jsonwebtoken');

class tokenService {

    constructor( secret) {
        this._secret = secret;

        this.create = this.create.bind(this);
        this.extractData = this.extractData.bind(this);
    }

    create( data) {
        return jwt.sign( data, this._secret);
    }

    extractData( token ) {
        
        try {
            return jwt.verify(token, this._secret);
        } catch(err) {
             throw new Error();
        }

    }
   
}

module.exports = tokenService;