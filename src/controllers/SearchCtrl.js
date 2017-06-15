const url = require('url');
const winston = require('winston');

class SearchCtrl {
    
    constructor( serieModel) {
        this._serieModel = serieModel;

        this.byTitle = this.byTitle.bind(this);
        this.byActor = this.byActor.bind(this);
        this.addApiSeriesToBdd = this.addApiSeriesToBdd.bind(this);

    }
    
    byTitle(req, res ) {
        
        // no request
        if( !res.locals.query) {
            const error = res.__('ERROR_SERVER');
            return res.status(500).render('error.twig', {status: 500, error,});
        }

        // retrieve service & lang
        const tmdbService = req.app.get('tmdbService');
        const lang =  req.getLocale();

        // search api
        tmdbService. searchByTitle( res.locals.query, lang)
        
        // save api results
        .then( series => {
            // keep  the first 20 series
            series = series.splice(0,20);

            // stats a promise loop to add serie's in bdd
            return Promise.resolve(series).then( this.addApiSeriesToBdd);
        })
        // search local database
        .then( () => {
            return this._serieModel.findByTitle( res.locals.query, lang, res.locals.page );
        })
        // render
        .then(data => {
            const currentUrl = res.locals.urlWithoutPages;
            const defaultPoster = req.app.get('conf').site.default.poster;
            
            res.render('series.twig', {data: data, currentUrl, defaultPoster,});
        })
        // catch error
        .catch( err => {
            winston.info('info', err);
            const error = res.__('ERROR_SERVER');

            res.status(500).render('error.twig', {status: 500, error,});
        });
    }

    byActor(req, res, next ) {
        
         // no request
        if( !res.locals.query) {
            const error = res.__('ERROR_SERVER');
            return res.status(500).render('error.twig', {status: 500, error,});
        }

        // retrieve service & lang
        const tmdbService = req.app.get('tmdbService');
        const lang =  req.getLocale();
        
        // search api
        tmdbService.searchByActors( res.locals.query, lang)
        
        // save api results
        .then( series => {
            // keep  the first 20 series
            series = series.splice(0,20);

            // stats a promise loop to add serie's in bdd
            return Promise.resolve(series).then( this.addApiSeriesToBdd);
        })
        // search local database
        .then( () => {
            return this._serieModel.findByActor( res.locals.query, lang,res.locals.page );
        })
        // render
        .then(data => {
            const currentUrl = res.locals.urlWithoutPages;
            const defaultPoster = req.app.get('conf').site.default.poster;
            
            res.render('series.twig', {data: data, currentUrl, defaultPoster,});
        })
        // catch error
        .catch( err => {
            winston.info('info', err);
            const error = res.__('ERROR_SERVER');

            res.status(500).render('error.twig', {status: 500, error,});
        });
    }

    // save api's series to bdd
    addApiSeriesToBdd( series ) {
        const serie = series.splice(0,1);
        if ( series.length > 0) {         
            return this._serieModel.insertApiSerie(serie[0])
            .then( () => this.addApiSeriesToBdd(series));
        }
    }
    
}


module.exports = SearchCtrl;
