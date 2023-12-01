FROM node:alpine

RUN npm install -g bun

WORKDIR /dist
COPY . /dist

RUN bun run build

CMD bun run production
