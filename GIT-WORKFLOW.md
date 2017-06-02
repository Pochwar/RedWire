# Git Workflow

## Developper une fonctionnalité

- Depuis la branche 'dev' créer une branche perso ('perso' pour l'exemple) : `git checkout -b perso`
- Developper :)


## Merger sa branche perso sur dev

1/ Pusher la branche 'perso'

- `git add .`
- `git commit -m "message de commit"`
- `git push -u origin perso`

2/ Rebaser la branche 'dev'

- `git checkout dev`
- `git pull origin dev`
- `git checkout perso`
- `git rebase dev`

3/ Si conflit, resoudre les conflits puis lancer les commandes suivantes, sinon passer en 4

- `git add .`
- `git rebase --continue`

PS : 'rebase' reprend la dernière version de 'dev' et applique TOUS les commits de la branche 'perso' les uns après les autres. S'il y a des conflits, il faut donc les résoudre pour tous les commits et refaire l'étape 3 à chaque fois.

4/ Pusher la branche perso rebasée

- `git push --force`

5/ Faire une Pull Request via github depuis la branche 'perso' vers la branche 'dev' (et pas 'master' !)

## Supprimer une branche

- En local : `git branch -d perso`
- Sur repo distant : `git push origin :perso`

## Recuperer les branches distantes

- `git fetch origin`
