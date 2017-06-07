const CONF = require('./../config/config_dev');

const tmdb = new (require('tmdbapi'))({apiv3: CONF.API.tmdb.token});

/*
 PARAMETERS
 */
let search = 'saul';
let lang = 'fr';

/*

console.log(`# Search : ${search}`)

//SEARCH SERIE
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
*/

//SEARCH PERSON
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


//SPECIFIC SERIE DETAIL (with list of seasons)
// tmdb.tv.details({tv_id: 60735, language: lang})
//     .then(response => {
//         console.log('SERIE DETAIL')
//         console.dir(response)
//     })
//     .catch(e => console.log(e))
// ;

//SPECIFIC SERIE DETAIL (with list of episodes with air time)
// tmdb.tv.season.details({tv_id: 60735, season: 3, language: lang})
//     .then(response => {
//         console.log('SEASON DETAIL')
//         console.dir(response)
//     })
//     .catch()
// ;