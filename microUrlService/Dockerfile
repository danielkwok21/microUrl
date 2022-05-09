FROM alpine:3.14

WORKDIR /usr/src/app

RUN ls

COPY package*.json ./

RUN npm install

COPY ./ ./

COPY database/micro_url_service_dump.sql /docker-entrypoint-initdb.d

EXPOSE 8080

CMD [ "node", "microUrlService.ts" ]