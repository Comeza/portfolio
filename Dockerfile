FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY yarn.json ./

RUN yarn

COPY . ./

RUN yarn build --production

CMD yarn build