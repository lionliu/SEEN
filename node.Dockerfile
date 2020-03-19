FROM node:latest
COPY ./SEEN-backend /var/www/
ENV PORT=5000
WORKDIR /var/www/
RUN ["npm", "install"]
RUN ["npm", "audit", "fix"]
ENTRYPOINT ["npm", "start"]
EXPOSE $PORT