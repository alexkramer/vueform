FROM node:7.5.0

# Create vueform directory.
RUN mkdir /srv/vueform
WORKDIR /srv/vueform

# Install dependencies.
RUN npm install yarn -g --no-progress
COPY package.json /srv/vueform/package.json
COPY yarn.lock /srv/vueform/yarn.lock
RUN yarn

# Copy remaining files over.
COPY . /srv/vueform

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
