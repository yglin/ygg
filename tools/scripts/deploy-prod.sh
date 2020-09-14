#! /bin/bash -x
project=$1
rootDir=`pwd`

# Point settings to production
firebase use product
cd .env
ln -fs $project/environments.production.json environments.json
cd ..

# build
ng build --prod

#deploy
firebase deploy


# Restore settings to local develop
firebase use default
cd .env
ln -fs $project/environments.local.json environments.json
cd ..
