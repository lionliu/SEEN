FROM node:latest
COPY ./SEEN-backend /var/www/
WORKDIR /var/www/
RUN npm install
ENTRYPOINT ["npm", "start"]
EXPOSE 5000