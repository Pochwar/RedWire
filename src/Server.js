import express from 'express';
import path from 'path';

export default class Server {
    constructor() {
        this._app = express();

        this._app.use(express.static(path.join(__dirname, '/../public')));

    }

    run(port) {
        // this._initControllers();

        this._app.listen(port, () => console.log(`Server listening on port ${port}`));
    }

    _initControllers() {
        const registrationCtrl = new RegistrationCtrl(this.title);
        const loginCtrl = new LoginCtrl(this.title);

        this._app.get('/register', registrationCtrl.index.bind(registrationCtrl));
        this._app.post('/register', registrationCtrl.form);
        this._app.get('/login', loginCtrl.index.bind(loginCtrl));
        this._app.post('/login', loginCtrl.form);
    }


}