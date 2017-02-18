FROM node:7.5.0

# Create vueform directory.
RUN mkdir /srv/vueform
WORKDIR /srv/vueform

# Install dependencies.
RUN npm install yarn -g
COPY . /srv/vueform
RUN yarn

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
