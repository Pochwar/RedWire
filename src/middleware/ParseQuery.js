const url = require('url');

class ParseQuery {

    static toLocals(req, res, next) {

        const queryData = url.parse(req.url, true).query;

        // get request
        let q = queryData.q || null;
        
        // save request in res
        res.locals.query = q;

        // get pages
        let p = queryData.p ? parseInt( queryData.p)-1 : null;

        // invalid queryData ?
        if( p && p < 0 ) {
            const error = res.__('ERROR_SERVER');
            return res.status(500).render('error.twig', {status: 500, error,});
        }

        // save pages in res
        res.locals.page = p;

        // get url
        let currentUrl = req.path + '?';

        // add query to url
        if( q ) {
            currentUrl += 'q='+q+'&';
        }

        // save url
        res.locals.urlWithoutPages = currentUrl;
        
        
        next();
    }
}

module.exports = ParseQuery;