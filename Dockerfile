FROM node:alpine

WORKDIR ./

# Copy main configs
COPY .eslintrc ./
COPY *.ts ./
COPY *.js ./
COPY *.json ./

# Copy source folder
COPY ./src ./src
COPY ./server ./server
COPY ./public ./public

# create main files
RUM yarn install
RUN yarn build

CMD yarn start
