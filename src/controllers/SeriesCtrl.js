const winston = require('winston');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class SeriesCtrl {
    constructor(model) {
        this._series = model;
        this.get = this.get.bind(this);
        this.getByTitle = this.getByTitle.bind(this);

        //this.test();
    }

    test() {
        this._series.registerSerie(
            "Ma bite 2",
            Date.now(),
            "fr", {
                api_id: 14,
                overview: "Un magnifique film sur ma teub",
                // poster: "public/img/mabite.jpeg",
                genres: ["drame", "familial", "comédie",],
                validated: 1,
                episodes: [{
                    local_id: 1,
                    api_id: 78,
                    number: 1,
                    season: 1,
                },],
            }
        )
            .then(serie => {
                winston.info("Série bien enregistrée: " + serie.title)
            })
            .catch(e => {
                winston.info('Une erreur est survenue: ' + e)
            })
    }

    get(req, res) {
        this._series.findAll()
            .then(series => {
                res.render('series.twig', {
                    series: series,
                });
            })
            .catch(e => {
                winston.info(e);
                res.status(500).render('series.twig', {
                    status: 500,
                    error: e,
                })
            })
    }

    post(req, res) {
        const api_id = req.body.api_id || null;
        const overview = req.body.overview || null;
        const poster = req.body.poster || null;
        const genres = req.body.genres.split(";") || [];
        const actors = req.body.actors.split(";") || [];
        const comments = req.body.comments || [];
        const episodes = [];
        const counter = req.body.counterEpisode;
        for (let i = 1; i < counter; i++) {
            if (counter > 0 && !(req.body.episode + i).number && !(req.body.episode + i).season) {
                res.render("add.twig", {
                    msg: res.__('REQUIREDFIELDS'),
                })
            } else {
                episodes.push(req.body.episode + i)
            }
        }
        const validated = req.body.validated || 0;
        const date = new Date();
        if (!req.body.title || !req.body.langCode) {
            res.render("add.twig", {
                msg: res.__('REQUIREDFIELDS'),
            })
        }


        this._series.registerSerie(
            req.title,
            date,
            {
                api_id: api_id,
                title: req.body.title,
                overview: overview,
                poster: poster,
                genres: genres,
                actors: actors,
                createdAt: date.now,
                updatedAt: date.now,
                langCode: req.body.langCode,
                validated: validated,
                episodes: episodes,
                comments: comments,
            }
        )
            .then(serie => {
                res.render("serie.twig", {
                    series: serie,
                })
            })
            .catch(e => {
                winston.info('Une erreur est survenue: ' + e);
                res.status(500)
                    .render("error.twig", {
                        status: 500,
                        error: res.__('ERROR_SERVER'),
                    })
            })
    }

    getByTitle(req, res) {
        this._series.findByTitle(req.body.title);
        res.render('series.twig', {
            series: "series",
        });
    }

    getById(req, res) {
        this._series.findByTitle(req.body.id);
        res.render('series.twig', {
            series: "series",
        });
    }
}

module.exports = SeriesCtrl;