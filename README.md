# RedWire

a school project

## Installation and launch

- clone repository
- install with npm : `npm install`
- build with npm : `npm run build`
- launch app with npm : `npm start`

## Linting code

- `npm run lint` To apply eslint for code in `./src`
- to create new rule, go to http://rapilabs.github.io/eslintrc-generator/ and copy new rules in `.eslintrc`, under the `rules` index

## Multilang

- languages files are in `locales` folder
- default language is 'fr'
- used language is store in a cookie
- to change language go to '/fr' or '/en'

Usage in twig templates :
`{{ __("LOCAL_VAR") }}` will display the value of "LOCAL_VAR" from the appropriate locale json file.

If "LOCAL_VAR" entry is not found is not found in the locale json file, it will be automatically created with a default value