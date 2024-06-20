FROM node:20-alpine@sha256:66c7d989b6dabba6b4305b88f40912679aebd9f387a5b16ffa76dfb9ae90b060

COPY .output /dist
COPY server/utils/db/postgres/migrations /dist/server/utils/db/postgres/migrations

WORKDIR /dist

CMD node server/index.mjs