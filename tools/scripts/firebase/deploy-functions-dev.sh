#! /bin/bash -x

project=$1
rootDir=`pwd`

# Setup environment to develop
firebase use develop
node tools/scripts/setup-environments.js $project develop

# build
ng build functions --prod

#deploy
firebase deploy --only functions


# Restore settings to develop project
firebase use default
cd .env
ln -fs $project/environments.local.json environments.json
cd $rootDir
