#### COMPILE MIRROR IMAGE ####
FROM node:18-buster as build

WORKDIR /app

COPY . /app

RUN npm i

WORKDIR /app/modules/MMM-DisneyWaitTimes
RUN npm i

WORKDIR /app
ENTRYPOINT node serveronly