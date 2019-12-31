#! /bin/bash -x

[ ! -f serviceAccount.json ] && ln -s ../../.firebase/serviceAccount.json serviceAccount.json
npx cypress-firebase createTestEnvFile
