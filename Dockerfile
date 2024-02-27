FROM node:alpine as builder

WORKDIR /usr/src/app/client

COPY package*.json .

RUN npm install --force

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/src/app/client/build .

RUN chown nginx:nginx /usr/share/nginx/html/*

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]