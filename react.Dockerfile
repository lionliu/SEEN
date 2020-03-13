FROM node:latest
COPY ./seen /var/www/
WORKDIR /var/www/
RUN npm install
ENTRYPOINT ["npm", "start"]
EXPOSE 3000