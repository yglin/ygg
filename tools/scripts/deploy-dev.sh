#! /bin/bash -x


project=$1
rootDir=`pwd`

# Setup environment to develop
firebase use develop
node tools/scripts/setup-environments.js $project develop

cd $rootDir

# Build
ng build --prod $project

# Deploy
firebase deploy --only hosting:$project

