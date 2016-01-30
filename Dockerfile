FROM node

RUN mkdir /webapp_root
ADD . /webapp_root/
WORKDIR /webapp_root

RUN npm install
RUN npm install -g bower
RUN npm install -g grunt-cli
RUN bower --allow-root install
RUN grunt

EXPOSE 3000

CMD node server.js
