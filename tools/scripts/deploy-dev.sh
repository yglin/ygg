#! /bin/bash -x

# Channel settings to product project
firebase use develop
cd .firebase
ln -fs project-config.develop.json project-config.json
cd ..

# build
ng build --prod

#deploy
firebase deploy


# Restore settings to develop project
firebase use default
cd .firebase
ln -fs project-config.default.json project-config.json
cd ..
