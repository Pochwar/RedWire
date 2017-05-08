import TVDB from 'node-tvdb';
const tvdb = new TVDB('207403D377FCA987');


tvdb.getSeriesByName('Breaking Bad')
    .then(response => {
        console.log("### Search ###")
        console.dir(response);
    })
    .catch(error => { /* handle error */ });

//get a serie's info + episodes
tvdb.getSeriesAllById(71663)
    .then(response => {
        console.log("### Serie's info & episodes ###")
        //console.dir(response);
    })
    .catch(error => { /* handle error */ });