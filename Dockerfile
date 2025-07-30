FROM node:22-slim AS app

WORKDIR app/
COPY ./package.json .
COPY ./package-lock.json .
COPY tsconfig.json .
RUN npm install
COPY ./src src/
RUN npm run build
