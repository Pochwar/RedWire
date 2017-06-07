# FishBlock

a school project !

## Installation and launch

- clone repository
- install with npm : `npm install`
- set configuration : `config/config_prod.js` has production configuration for Heroku (app available at "https://fishblock.herokuapp.com/"). To use app in development mode, copy `config/config_prod.js` to `config/config_dev.js` and set your DB, server and API tokens configuration variables
- launch app with npm : `npm start`

## Linting code

- `npm run lint` To apply eslint for code in `./src`
- to create new rule, go to http://rapilabs.github.io/eslintrc-generator/ and copy new rules in `.eslintrc`, under the `rules` index

## Internationalisation

- languages files are in `locales` folder
- default language is 'fr'
- used language is store in a cookie
- to change language go to '/fr' or '/en'

Usage in twig templates :
`{{ __("LOCAL_VAR") }}` will display the value of "LOCAL_VAR" from the appropriate locale json file.

If "LOCAL_VAR" entry is not found is not found in the locale json file, it will be automatically created with a default value

## Faker

Faker is used to populate DB with fake users.
Set quantity of fake users to create in config/config.js, then run `npm run faker`

## Architecture

Website architecture and routes can be checked here : https://coggle.it/diagram/WTUSkiIjogAB_ihz

## Test
Use testing to see valid routing, unit testing, etc...
- `npm test` run all tests
- `npm run test:watch` run all tests and watch files to change
- `npm run test:public` run tests for public section only
- `npm run test:member` run tests for members section only
- `npm run test:admin` run tests for admin section only