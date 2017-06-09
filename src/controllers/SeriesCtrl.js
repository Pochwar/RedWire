const winston = require('winston');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class SeriesCtrl {
    constructor(model) {
        this._serie = model;
        this.get = this.get.bind(this);
        this.getByTitle = this.getByTitle.bind(this);

        // this.test();
    }

    test() {
        this._serie.registerSerie(
            14,
            "Ma bite 2",
            "Un magnifique film sur ma teub",
            "public/img/mabite.jpeg",
            ["drame", "familial", "comédie",],
            [],
            Date.now(),
            "fr",
            1,
            [],
            []
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