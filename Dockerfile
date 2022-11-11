FROM node:17.5.0-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]

RUN npm install

COPY . .

CMD npm run migrate && npm run start
