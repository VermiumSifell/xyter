FROM node:16

LABEL maintainer="xyter@zyner.org"

WORKDIR /app

COPY package* .
RUN npm install

COPY . .

RUN npx -y tsc

WORKDIR /app/build

CMD [ "node", "." ]