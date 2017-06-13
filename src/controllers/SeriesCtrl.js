const winston = require('winston');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

class SeriesCtrl {
    constructor(model) {
        this._series = model;
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.getByTitle = this.getByTitle.bind(this);
        this.getById = this.getById.bind(this);
        this.getEpisodeById = this.getEpisodeById.bind(this);

        // this.test();
    }

    test() {
        this._series.registerSerie(
            "Copullae demonus est",
            Date.now(),
            "fr", {
                // api_id: 14,
                overview: "Zombies reversus ab inferno, nam malum cerebro. De carne animata corpora quaeritis. Summus sit​​, morbo vel maleficia? De Apocalypsi undead dictum mauris. Hi mortuis soulless creaturas, imo monstra adventus vultus comedat cerebella viventium. Qui offenderit rapto, terribilem incessu. The voodoo sacerdos suscitat mortuos comedere carnem. Search for solum oculi eorum defunctis cerebro. Nescio an Undead zombies. Sicut malus movie horror.",
                // poster: "public/img/cde.jpeg",
                genres: ["drame", "familial", "comédie",],
                validated: 1,
                episodes: [{
                    local_id: 1,
                    api_id: 78,
                    number: 1,
                    season: 1,
                    title: "Au commencement était le démon",
                    overview: "Cum horribilem resurgere de sepulcris creaturis, sicut de iride et serpens. Pestilentia, ipsa screams. Pestilentia est haec ambulabat mortuos. Sicut malus voodoo. Aenean a dolor vulnerum aperire accedunt, mortui iam vivam. Qui tardius moveri, sed in magna copia sint terribiles legionis. Alii missing oculis aliorum sicut serpere crabs nostram. Putridi odores aere implent.",
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

    getForm(req, res) {
        res.render('add.twig')
    }

    post(req, res) {
        const api_id = req.body.api_id || null;
        const overview = req.body.overview || null;
        const poster = req.body.poster || "/img/default.png";
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
                winston.info("Serie registred: " + serie.title)
                res.render("serie.twig", {
                    series: serie,
                })
            })
            .catch(e => {
                winston.info('Error caught: ' + e);
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
        const _id = mongoose.Types.ObjectId(req.params.id)
        this._series.findById(_id)
            .then(serie => {
                res.render('serie.twig', {
                    serie: serie,
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

    getEpisodeById(req, res) {
        const _id = mongoose.Types.ObjectId(req.params.id)
        this._series.findEpisodeById(_id)
            .then(serie => {
                const episode = serie.episodes[0];
                res.render('episode.twig', {
                    episode: episode,
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
}

module.exports = SeriesCtrl;