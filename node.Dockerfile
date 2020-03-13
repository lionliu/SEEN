FROM node:latest
MAINTAINER Iot_Flows
COPY ./SEEN-backend /var/www/
WORKDIR /var/www/
RUN npm install
COPY ./SEEN-backend/.env /var/www
ENTRYPOINT ["npm", "start"]
EXPOSE 5000