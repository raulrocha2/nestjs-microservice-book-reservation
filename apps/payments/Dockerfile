FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/payments/package.json apps/payments/package.json
RUN npm install -g pnpm

RUN pnpm install -r

COPY apps/payments apps/payments
COPY libs libs

RUN pnpm run build payments

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

COPY apps/payments/package.json apps/payments/package.json

RUN npm install -g pnpm

RUN pnpm install -r --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/payments/main"]