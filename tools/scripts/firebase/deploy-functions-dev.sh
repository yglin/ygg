#! /bin/bash -x

project=$1
rootDir=`pwd`

# Channel settings to product project
firebase use develop
cd .firebase
ln -fs project-config.develop.json project-config.json
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
cd .firebase
ln -fs project-config.default.json project-config.json
cd $rootDir
