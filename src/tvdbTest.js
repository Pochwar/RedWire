const CONF = require('./../config/config');

const TVDB  = require('node-tvdb');
const tvdb = new TVDB(CONF.API.tvdb.token);

/*
PARAMETERS
 */
let search = 'breaking bad';
let lang = 'fr';

let i = 1;
tvdb.getSeriesByName(search, {lang : lang})
    .then(response => {
        console.log(`# Search : ${search}`)
        console.log(`\n`);
        response.forEach(serie => {
            tvdb.getActors(serie.id)
                .then(actors => {
                    console.log(`## Result N°${i}`);
                    console.log(`id : ${serie.id}`);
                    console.log(`name : ${serie.seriesName}`);
                    console.log(`network : ${serie.network}`);
                    console.log(`overview : ${serie.overview}`);
                    if(actors !== null){
                        console.log(`actors :`);
                        actors.forEach(actor => {
                            console.log(`- ${actor.name} (role : ${actor.role})`);
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



//get a serie's info + episodes
// tvdb.getSeriesAllById(71663)
//     .then(response => {
//         console.log("### Serie's info & episodes ###")
//         console.dir(response);
//     })
//     .catch(e => console.log(e));
// ;