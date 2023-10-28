from node:alpine

workdir /pully-server

copy package.json ./
copy ./src ./src

expose 3008

run npm install

cmd ["npm", "run", "start"]