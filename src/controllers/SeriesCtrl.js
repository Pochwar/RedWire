const winston = require('winston');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class SeriesCtrl {
    constructor(model) {
        this.serie = model;
        this.get = this.get.bind(this);
        this.getByTitle = this.getByTitle.bind(this);
    }

    get(req, res) {
        this.serie.findAll()
            .then(series => {
                res.render('series.twig', {
                    series: series,
                })
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