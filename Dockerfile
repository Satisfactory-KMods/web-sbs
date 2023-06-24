FROM node:18-bullseye

WORKDIR /

COPY package.json ./
COPY *.lock ./

RUN npm i

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
RUN yarn build

CMD yarn start
