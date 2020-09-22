#! /bin/bash -x

project=$1
target=$2
rootDir=`pwd`

# Setup environment to develop
firebase use default
node tools/scripts/setup-environments.js $project $target

# build
ng build functions --prod
