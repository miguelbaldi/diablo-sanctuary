FROM node:20.8.0-alpine
RUN apk add g++ make
RUN apk add --no-cache python3 py3-pip
WORKDIR /diablo-sanctuary/

COPY public/ /diablo-sanctuary/public
COPY src/ /diablo-sanctuary/src
COPY package.json /diablo-sanctuary/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]