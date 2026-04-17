FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/notifications/package.json apps/notifications/package.json

RUN npm install -g pnpm

RUN pnpm install -r

COPY apps/notifications apps/notifications
COPY libs libs

RUN pnpm run build notifications

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY apps/notifications/package.json apps/notifications/package.json

RUN npm install -g pnpm

RUN pnpm install -r --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/notifications/main"]