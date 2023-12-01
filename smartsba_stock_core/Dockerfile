FROM node:18.15-alpine AS build
RUN apk update && apk upgrade && adduser -D nuxtuser
RUN npm install -g pnpm@8.6.2
USER nuxtuser
WORKDIR /app
COPY --chown=nuxtuser:nuxtuser ./package.json /app
COPY --chown=nuxtuser:nuxtuser ./nuxt.config.ts /app
COPY --chown=nuxtuser:nuxtuser ./tsconfig.json /app
RUN ls -la
COPY --chown=nuxtuser:nuxtuser ./.npmrc /app
RUN pnpm install
COPY --chown=nuxtuser:nuxtuser ./src /app/src
RUN pnpm build

FROM node:18.15-alpine
RUN apk update && apk upgrade && apk add dumb-init && adduser -D nuxtuser 
USER nuxtuser
WORKDIR /app
COPY --chown=nuxtuser:nuxtuser --from=build /app/.output ./
ENV PORT=8080 NODE_ENV=production
CMD ["dumb-init","node","/app/server/index.mjs"]
