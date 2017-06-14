const winston = require('winston');
const mongoose = require('mongoose');
const url = require('url');

mongoose.Promise = global.Promise;

class SeriesCtrl {
    constructor(model) {
        this._series = model;
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.getByTitle = this.getByTitle.bind(this);
        this.getById = this.getById.bind(this);
        this.getEpisodeById = this.getEpisodeById.bind(this);
        this.putUserFollow = this.putUserFollow.bind(this);

        // this.test();
    }

    test() {
        this._series.registerSerie(
            "Copullae demonus est",
            Date.now(),
            "fr", {
                // api_id: 14,
                overview: "Zombie ipsum brains reversus ab cerebellum viral inferno, brein nam rick mend grimes malum cerveau cerebro. De carne cerebro lumbering animata cervello corpora quaeritis. Summus thalamus brains sit​​, morbo basal ganglia vel maleficia? De braaaiiiins apocalypsi gorger omero prefrontal cortex undead survivor fornix dictum mauris. Hi brains mindless mortuis limbic cortex soulless creaturas optic nerve, imo evil braaiinns stalking monstra hypothalamus adventus resi hippocampus dentevil vultus brain comedat cerebella pitiutary gland viventium. Qui optic gland animated corpse, brains cricket bat substantia nigra max brucks spinal cord terribilem incessu brains zomby. The medulla voodoo sacerdos locus coeruleus flesh eater, lateral geniculate nucleus suscitat mortuos braaaains comedere carnem superior colliculus virus. Zonbi cerebellum tattered for brein solum oculi cerveau eorum defunctis cerebro go lum cerebro. Nescio brains an Undead cervello zombies. Sicut thalamus malus putrid brains voodoo horror. Nigh basal ganglia tofth eliv ingdead.",
                // poster: "public/img/cde.jpeg",
                genres: ["drame", "familial", "comédie",],
                validated: 1,
                episodes: [
                    {
                        local_id: 1,
                        api_id: 78,
                        number: 1,
                        season: 1,
                        title: "Au commencement était le démon",
                        overview: "Cum horribilem resurgere de sepulcris creaturis, sicut de iride et serpens. Pestilentia, ipsa screams. Pestilentia est haec ambulabat mortuos. Sicut malus voodoo. Aenean a dolor vulnerum aperire accedunt, mortui iam vivam. Qui tardius moveri, sed in magna copia sint terribiles legionis. Alii missing oculis aliorum sicut serpere crabs nostram. Putridi odores aere implent.",
                    },
                    {
                        api_id : 82,
                        number : 2,
                        season : 1,
                        title : "Coitus ergo sum",
                        overview : "Zombies reversus ab inferno, nam malum cerebro. De carne animata corpora quaeritis. Summus sit​​, morbo vel maleficia? De Apocalypsi undead dictum mauris. Hi mortuis soulless creaturas, imo monstra adventus vultus comedat cerebella viventium. Qui offenderit rapto, terribilem incessu. The voodoo sacerdos suscitat mortuos comedere carnem. Search for solum oculi eorum defunctis cerebro. Nescio an Undead zombies. Sicut malus movie horror.",
                    },
                ],
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
        // parse request
        const queryData = url.parse(req.url, true).query;

        // parse page number
        let p = null;
        if( queryData.p ) {
            p = parseInt( queryData.p) -1;
        }

        // check if page number is valid
        if( p && p < 0 ) {
            const error = res.__('ERROR_INVALIDQUERY');
            res.status(400).render('error.twig', {status: 400, error,});
        }

        // retrieve service & lang
        const lang =  req.getLocale();

        // search local database
        this._series.findAll( lang, p )
        
        // render
        .then(data => {
            const currentUrl = req.path;
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

    getForm(req, res) {
        res.render('add.twig')
    }

    post(req, res) {
        const api_id = req.body.api_id || null;
        const overview = req.body.overview || null;
        const poster = req.body.poster || "/img/default.png";
        const genres = req.body.genres ? req.body.genres.split(";") : [];
        const actors = req.body.actors ? req.body.actors.split(";") : [];
        const comments = req.body.comments || [];
        const episodes = [];
        const counter = req.body.counterEpisode;
        for (let i = 1; i < counter; i++) {
            if (counter > 0 && !(req.body.episode + i).number && !(req.body.episode + i).season) {
                return res.render("add.twig", {
                    msg: res.__('REQUIREDFIELDS'),
                })
            } else {
                episodes.push(req.body.episode + i)
            }
        }
        const validated = req.body.validated || 0;
        const date = new Date();
        if (!req.body.title || !req.body.langCode) {
            return res.render("add.twig", {
                msg: res.__('REQUIREDFIELDS'),
            })
        }


        this._series.registerSerie(
            req.body.title,
            date,
            req.getLocale(),
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
                winston.info('SeriesCtrl/post/Error caught: ' + e);
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

    putUserFollow(req, res) {
        //check db connection
        if (mongoose.connection._readyState !== 1) {
            res.render('error.twig', {
                status: 500,
                error: res.__('ERROR_SERVER'),
            });
            return;
        }

        console.log(res.locals.user);
        this._series.followSerie(res.locals.user._id, req.params.id)
        .then(() => {
            res.json({ msg: "OK" });
        })
        .catch((error) => {
            winston.info("info", error);
            res.json({ msg: "Error" });
        })
       
    }

}

module.exports = SeriesCtrl;