FROM node:16

LABEL maintainer="me@jqshuv.xyz"
LABEL org.opencontainers.image.source https://github.com/ZynerOrg/xyter
LABEL org.opencontainers.image.description "An multi-purpose discord.js bot."
LABEL org.opencontainers.image.licenses=GPL-3.0-only


WORKDIR /app

LABEL maintainer="me@jqshuv.xyz"
LABEL org.opencontainers.image.source https://github.com/ZynerOrg/xyter
LABEL org.opencontainers.image.description "An multi-purpose discord.js bot."
LABEL org.opencontainers.image.licenses=GPL-3.0-only

COPY package* .
RUN npm install

COPY . .
RUN mv src/config_docker src/config

RUN npx tsc

RUN npx tsc -v > /app/tsc.log
RUN npm -v > /app/npm.log
RUN node -v > /app/node.log

WORKDIR /app/build

CMD [ "npx", "nodemon" ]