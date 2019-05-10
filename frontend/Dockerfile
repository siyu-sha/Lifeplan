FROM node

WORKDIR /app/frontend
COPY ./package.json /app/frontend/package.json
COPY ./package-lock.json /app/frontend/package-lock.json

RUN npm install

EXPOSE 3000
ENTRYPOINT npm start
