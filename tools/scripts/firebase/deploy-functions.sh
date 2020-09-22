#! /bin/bash -x

script_dir=$(dirname "$0")
project=$1
target=$2
rootDir=`pwd`

# build
${script_dir}/build-functions.sh $project $target

#deploy
firebase deploy --only functions
