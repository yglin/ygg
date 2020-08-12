#! /bin/bash -x

# Point settings to develop
firebase use develop
cd .firebase
ln -fs project-config.develop.json project-config.json
cd ..
cd .env
ln -fs environments.develop.json environments.json
cd ..

# build
ng build --prod

#deploy
firebase deploy


# Restore settings to local
firebase use default
cd .firebase
ln -fs project-config.default.json project-config.json
cd ..
cd .env
ln -fs environments.local.json environments.json
cd ..
