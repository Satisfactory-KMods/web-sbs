FROM node:alpine

WORKDIR ./

# Copy main configs
COPY .eslintrc ./
COPY .env ./
COPY *.ts ./
COPY *.js ./
COPY *.json ./

# Copy source folder
COPY ./lib ./lib
COPY ./pages ./pages
COPY ./public ./public
COPY ./pages ./pages

# create main files
RUN yarn build

CMD yarn start
