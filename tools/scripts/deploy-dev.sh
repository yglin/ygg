#! /bin/bash -x


project=$1
rootDir=`pwd`

# Point settings to develop
firebase use develop
cd .env
ln -fs $project/environments.develop.json environments.json
cd $rootDir

# Build
ng build --prod $project

# Associate project with deploy target site
firebase target:apply hosting $project $project-dev

# Deploy
firebase deploy --only hosting:$project


# Restore settings to local develop
firebase use default
cd .env
ln -fs $project/environments.local.json environments.json
cd $rootDir
