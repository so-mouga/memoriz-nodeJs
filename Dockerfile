FROM node:8.15.0-alpine

WORKDIR /usr/app/memoriz

COPY package.json .
COPY package-lock.json .

RUN apk update && apk add
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install -g nodemon
RUN npm install -g pg
RUN npm install --quiet

COPY . .

