FROM node:latest
COPY ./seen /var/www/public
ENV PORT=3000
WORKDIR /var/www/public
RUN ["npm", "install"]
RUN ["npm", "audit", "fix"]
ENTRYPOINT ["npm", "start"]
EXPOSE ${PORT}