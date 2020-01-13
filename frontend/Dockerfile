FROM node:alpine

COPY ./package.json /app/frontend/package.json
COPY ./package-lock.json /app/frontend/package-lock.json
RUN cd /app/frontend && \
    yarn install
WORKDIR /app/frontend

EXPOSE 3000
CMD yarn start
