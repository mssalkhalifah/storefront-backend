FROM node:17.5.0-alpine

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]
COPY . .

RUN npm install

CMD npm run migrate && npm run start
