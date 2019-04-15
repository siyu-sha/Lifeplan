FROM node

WORKDIR /app/frontend
COPY ./package.json /app/frontend/package.json

RUN npm install

EXPOSE 3000
ENTRYPOINT npm start
