FROM node:16.14.0-alpine as builder

WORKDIR /app
COPY . /app

USER root
RUN apk update && apk upgrade

RUN npm run build
RUN rm -rf node_modules/
RUN npm install && npm cache clean --force

FROM node:16.14.0-alpine

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 4000

CMD [ "node", "/dist/index.js" ]