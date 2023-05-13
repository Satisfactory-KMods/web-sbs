FROM node:alpine

WORKDIR ./

# Packages
COPY .npmrc ./
COPY *.json ./
COPY *.lock ./
RUN yarn install

# Copy main configs
COPY *.cts ./
COPY *.mts ./
COPY *.js ./
COPY *.mts ./
COPY *.cjs ./
COPY *.html ./

# Copy source folder
COPY ./src ./src
COPY ./server ./server
COPY ./public ./public

# create main files
RUN yarn build

CMD yarn production
