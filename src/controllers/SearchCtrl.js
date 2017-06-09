const url = require('url');
const winston = require('winston');

Promise.prototype.thenReturn = function(value) {
    return this.then(function() {
        console.log(value);
        return value; 
    });
};

class IndexCtrl {
    
    constructor( serieModel) {
        this._serieModel = serieModel;

        this.indexAction = this.indexAction.bind(this);
        this.addApiSeriesToBdd = this.addApiSeriesToBdd.bind(this);
    }

    indexAction(req, res ) {
        
        // parse request
        const queryData = url.parse(req.url, true).query;

        // check if query is present
        if ( !queryData.q) {
            res.status(400).render('error.twig');
        }

        // retrieve service & lang
        const tmdbService = req.app.get('tmdbService');
        const lang =  req.getLocale();

        // search api
        tmdbService. searchByTitle( queryData.q, lang)
        
        // save api results && search local db
        .then( series => {
            console.log(series);
            console.log('------------');
            return this.addApiSeriesToBdd(series);
        })
        .then( result => {
            console.log('END');
            res.render('series.twig');
        })
        // catch error
        .catch( err => {
            winston.info('info', err);
            res.status(400).render('error.twig');
        });
    }

    // save api's series to bdd
    addApiSeriesToBdd( series ) {
        
        return Promise.resolve(0).then( (function loop(i) {
        
            let serie = series.splice(0,1);
            console.log(serie);
            if ( series.length > 0) {             
                return this._serieModel.addIfNotExits(serie).then(loop);
            }
        }).bind(this));
        
    }
    
}


module.exports = IndexCtrl;
