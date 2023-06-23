FROM nikolaik/python-nodejs:latest

WORKDIR /

# Packages
# COPY .npmrc ./
COPY package.json ./
COPY *.lock ./

#RUN apk add --no-cache g++ make py3-pip
#RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev
#RUN npm install --build-from-source sharp
#RUN npm install --build-from-source libvips
# RUN npm_config_build_from_source=true  yarn add libvips
RUN yarn install

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
