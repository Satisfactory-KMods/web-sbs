FROM node:18-bullseye

RUN apt-get update && \
  apt-get install -y python-is-python3 python3 python3-dev python3-pip python3-virtualenv && \
  rm -rf /var/lib/apt/lists/* && \
  python --version && \
  node -v && npm -v
RUN npm install -g pnpm

WORKDIR /

COPY package.json ./
COPY *.yaml ./

RUN pnpm install --frozen-lockfile

# Copy main configs
COPY *.json ./

COPY *.ts ./
COPY *.cts ./
COPY *.mts ./

COPY *.js ./
COPY *.cjs ./
COPY *.mjs ./

COPY .env ./

# Copy source folder
COPY ./src ./src
COPY ./public ./public
COPY ./prisma ./prisma

# create main files
RUN pnpm build

# test
RUN rm -r ./src

CMD pnpm start
