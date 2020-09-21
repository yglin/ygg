#! /bin/bash -x
project=$1
rootDir=`pwd`

node tools/scripts/setup-environments.js $project local
ng serve $project