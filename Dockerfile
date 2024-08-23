#### COMPILE MIRROR IMAGE ####
FROM node:16-buster as build

WORKDIR /app

COPY . /app

RUN npm i

WORKDIR /app/modules/MMM-DisneyWaitTimes
RUN npm i

WORKDIR /app
ENTRYPOINT node serveronly