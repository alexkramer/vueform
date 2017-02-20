pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'docker build -t optick/vueform:latest .'
      }
    }
    stage('Lint') {
      steps {
        sh 'docker run --rm optick/vueform npm run lint --silent'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Unit": {
            sh 'docker run --rm optick/vueform npm run unit --silent'
          },
          "End-to-end": {
            sh 'docker info'
            sh 'docker network create selenium'
            sh 'docker run -d --name hub --network="selenium" -p 4444 selenium/hub'
            sh 'docker run -d --name chrome --network="selenium" \
                -e HUB_PORT_4444_TCP_ADDR=hub \
                -e HUB_PORT_4444_TCP_PORT=4444 \
                selenium/node-chrome'
            sh 'docker run -d --name firefox --network="selenium" \
                -e HUB_PORT_4444_TCP_ADDR=hub \
                -e HUB_PORT_4444_TCP_PORT=4444 \
                selenium/node-firefox'
            sh 'docker run --rm --name frontend --network="selenium" \
                -e SELENIUM_HUB_HOST=hub \
                -e SERVER_HOST=frontend \
                optick/vueform npm run e2e --silent'
          }
        )
      }
    }
    stage('Cleanup') {
      steps {
        sh 'docker kill hub chrome firefox'
        sh 'docker rm hub chrome firefox'
        sh 'docker network rm selenium'
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying'
      }
    }
  }
}
