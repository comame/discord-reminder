FROM node:alpine

WORKDIR /home/node

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i

COPY . /home/node

CMD node /home/node/src
