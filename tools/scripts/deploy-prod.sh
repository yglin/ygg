#! /bin/bash -x
project=$1
rootDir=`pwd`

# Point settings to production
firebase use product
node tools/scripts/setup-environments.js $project product

# build
ng build --prod

#deploy
firebase deploy


# Restore settings to local develop
firebase use default
cd .env
ln -fs $project/environments.local.json environments.json
cd ..
