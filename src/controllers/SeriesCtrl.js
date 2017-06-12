const winston = require('winston');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class SeriesCtrl {
    constructor(model) {
        this._serie = model;
        this.get = this.get.bind(this);
        this.getByTitle = this.getByTitle.bind(this);

        this.test();
    }

    test() {
        this._serie.registerSerie(
            "Ma bite 2",
            Date.now(),
            "fr",
            {api_id: 14,
            overview: "Un magnifique film sur ma teub",
            // poster: "public/img/mabite.jpeg",
            genres: ["drame", "familial", "comédie",],
            validated: 1,
            episodes: [{
                local_id: 1,
                api_id: 78,
                number: 1,
                season: 1,
            },],}
        )
    }

    get(req, res) {
        this._serie.findAll()
            .then(series => {
                winston.info(series.title);
                res.render('series.twig', {
                    series: series,
                });
            })
            .catch(e => {
                winston.info(e);
                res.render('series.twig', {
                    series: e,
                })
            })
    }

    getByTitle(req, res) {
        // const series = SerieModel.findByTitle(req.body.title);
        res.render('series.twig', {
            series: "series",
        });
    }
}

module.exports = SeriesCtrl;