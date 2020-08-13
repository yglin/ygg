#! /bin/bash -x

project=$1
rootDir=`pwd`

# Channel settings to product project
firebase use develop
cd .env
ln -fs environments.develop.json environments.json
cd $rootDir

# build
cd apps/$project
tsc --project tsconfig.functions.json
cd $rootDir
cp dist/functions/apps/$project/src/functions/main.js dist/functions/main.js
cp dist/functions/apps/$project/src/functions/main.js.map dist/functions/main.js.map

#deploy
firebase deploy --only functions


# Restore settings to develop project
firebase use default
cd .env
ln -fs environments.local.json environments.json
cd $rootDir
