FROM node:16

RUN apt-get install libcurl4

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
