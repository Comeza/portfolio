FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./

RUN yarn
COPY . .

CMD yarn build
