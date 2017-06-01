const CONF = require('./../config/config');

const tmdb = new (require('tmdbapi'))({apiv3: CONF.API.tmdb.token});

/*
 PARAMETERS
 */
let search = 'Simpson';
let lang = 'fr';

console.log(`# Search : ${search}`)

let i = 1;
tmdb.search.tv({
    query: search,
    language: lang
    })
    .then(response => {
        response.results.forEach(serie => {
            tmdb.tv.credits({tv_id: serie.id})
                .then(actors => {
                    console.log(`## Result N°${i} in SERIES`);
                    console.log(`id : ${serie.id}`);
                    console.log(`name : ${serie.name}`);
                    console.log(`popularity : ${serie.popularity}`);
                    console.log(`overview : ${serie.overview}`);
                    if(actors !== null){
                        console.log(`actors :`);
                        actors.cast.forEach(actor => {
                            console.log(`- ${actor.name} (role : ${actor.character})`);
                        });
                    }
                    console.log(`\n`);
                    i++;
                })
                .catch(e => console.log(e))
            ;
        })
    })
    .catch(e => console.log(e))
;

let j = 1;
tmdb.search.person({
    query: search,
    language: lang
    })
    .then(response => {
        response.results.forEach(actor => {
            console.log(`## Result N°${j} in ACTORS`);
            console.log(`id : ${actor.id}`);
            console.log(`name : ${actor.name}`);
            console.log(`known for :`);
            actor.known_for.forEach(movie => {
                console.log(`- ${movie.title}`)
            })
            console.log(`\n`);
            j++;

        })
    })
    .catch(e => console.log(e))
;