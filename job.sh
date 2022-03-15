#! /bin/bash

echo 'publish start'
echo 'repository: '$1   ' branch: '$2

cd ../$1

git checkout .
git checkout $2
git pull origin $2

pm2 stop www

cd ./client
yarn
yarn build

cd ..
yarn
npm run prd



