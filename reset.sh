#!bin/bash
rm yarn.lock
rm wx-bot.memory-card.json
rm -rf node_modules


which "yarn" > /dev/null
if [ $? -eq 0 ]
then
  echo command is exist
else
  echo "=======下载yarn中======="
  npm i yarn -g
fi

yarn upgrade
yarn