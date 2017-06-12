const url = require('url');
const winston = require('winston');

class SearchCtrl {
    
    constructor( serieModel) {
        this._serieModel = serieModel;

        this.byTitle = this.byTitle.bind(this);
        this.addApiSeriesToBdd = this.addApiSeriesToBdd.bind(this);

    }
    
    byTitle(req, res ) {
        
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
        
        // save api results
        .then( series => {
            // keep  the first 20 series
            series = series.splice(0,20);

            // stats a promise loop to add serie's in bdd
            return Promise.resolve(series).then( this.addApiSeriesToBdd);
        })
        // search local database
        .then( () => {
            return this._serieModel.findByTitle( queryData.q, lang );
        })
        // render
        .then(data => {

            res.render('series.twig', {data: data, url : req.originalUrl});
        })
        // catch error
        .catch( err => {
            winston.info('info', err);
            res.status(400).render('error.twig');
        });
    }

    // save api's series to bdd
    addApiSeriesToBdd( series ) {
        let serie = series.splice(0,1);
        if ( series.length > 0) {         
            return this._serieModel.addIfNotExits(serie[0])
            .then( () =>this.addApiSeriesToBdd(series));
        }
    }
    
}


module.exports = SearchCtrl;
