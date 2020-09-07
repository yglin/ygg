#! /bin/bash -x

project=$1
rootDir=`pwd`

# Channel settings to product project
firebase use develop
cd .env
ln -fs environments.develop.json environments.json
cd $rootDir

# build
ng build functions --prod

#deploy
firebase deploy --only functions


# Restore settings to develop project
firebase use default
cd .env
ln -fs environments.local.json environments.json
cd $rootDir
