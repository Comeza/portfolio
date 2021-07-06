FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY . ./

RUN yarn install

CMD yarn build --production
