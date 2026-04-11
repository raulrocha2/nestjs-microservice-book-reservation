FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

ENV CI=true
RUN pnpm install

CMD ["pnpm", "test"]