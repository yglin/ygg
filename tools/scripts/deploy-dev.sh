#! /bin/bash -x

# Point settings to develop
firebase use develop
cd .env
ln -fs environments.develop.json environments.json
cd ..

# build
ng build --prod

#deploy
firebase deploy


# Restore settings to local develop
firebase use default
cd .env
ln -fs environments.local.json environments.json
cd ..
