FROM node:14
WORKDIR ./
COPY package.json .
RUN yarn install
COPY . .
CMD yarn dev