FROM mhart/alpine-node:8
# FROM node:latest
MAINTAINER Rhio Kim <rhio.kim@gmail.com>

# RUN apk add --no-cache git openssh

# Copy package first to cache npm-install and speed up build
RUN mkdir -p server
WORKDIR server

COPY libs libs
COPY routes routes
COPY handlers handlers
COPY config.json config.json
COPY index.js index.js
COPY package.json package.json

RUN npm install --quiet --no-color --prod

ENV PORT 8082

EXPOSE $PORT

CMD ["npm", "start"]
