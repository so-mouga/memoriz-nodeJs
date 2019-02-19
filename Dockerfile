FROM node:8.15.0-alpine

WORKDIR /usr/app/memoriz

COPY package.json .
COPY package-lock.json .

RUN npm install --quiet

COPY . .

