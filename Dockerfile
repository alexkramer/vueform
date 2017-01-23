FROM node:7.4.0

# Create vueform directory.
RUN mkdir /srv/vueform
WORKDIR /srv/vueform

# Install Caddy.
COPY install_caddy.sh /srv/vueform
RUN ./install_caddy.sh

# Install dependencies.
RUN npm install yarn -g
COPY package.json /srv/vueform
COPY yarn.lock /srv/vueform
RUN yarn

# Build vueform.
COPY . /srv/vueform
RUN npm run build

EXPOSE 8080

CMD [ "caddy" ]
