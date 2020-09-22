#! /bin/bash -x


project=$1
target=$2
rootDir=`pwd`

# Setup environment to develop
firebase use develop
node tools/scripts/setup-environments.js $project $target

# Build
ng build --prod $project

# Deploy
firebase deploy --only hosting:$project
firebase deploy --only firestore:rules

