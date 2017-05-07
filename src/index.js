import TVDB from 'node-tvdb';
const tvdb = new TVDB('207403D377FCA987');

tvdb.getSeriesByName('The Simpsons')
    .then(response => {
        console.dir(response);
    })
    .catch(error => { /* handle error */ });