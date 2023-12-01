FROM node:18-bullseye

RUN npm install -g pnpm bun

WORKDIR /dist
COPY . /dist

RUN pnpm install
RUN bun run build

CMD bun run production
