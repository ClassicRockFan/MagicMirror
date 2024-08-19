#### COMPILE MIRROR IMAGE ####
FROM node:12-buster as build

WORKDIR /app

COPY . /app

RUN npm i

WORKDIR /app/modules/MMM-DisneyWaitTimes
RUN npm i

WORKDIR /app/vendor
RUN npm i

WORKDIR /app
ENTRYPOINT node serveronly