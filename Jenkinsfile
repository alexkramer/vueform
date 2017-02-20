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
            sh 'docker run -d --rm --name hub -p 4444 selenium/hub'
            sh 'docker run -d --rm --name frontend --link hub \
                -e SELENIUM_HUB_HOST=hub \
                -e SERVER_HOST=frontend \
                optick/vueform npm run e2e --silent'
            sh 'docker run -d --rm --name chrome --link frontend --link hub \
                selenium/node-chrome'
            sh 'docker run -d --rm --name firefox --link frontend --link hub \
                selenium/node-firefox'
          }
        )
      }
    }
    stage('Cleanup') {
      steps {
        sh 'docker kill hub chrome firefox'
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying'
      }
    }
  }
}
