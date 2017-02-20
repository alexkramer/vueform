pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh "docker build -t optick/vueform:latest ."
      }
    }
    stage('Lint') {
      steps {
        sh "docker run --rm optick/vueform npm run lint --silent"
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Unit": {
            sh "docker run --rm optick/vueform npm run unit --silent"
          },
          "End-to-End": {
            sh "docker network create ${env.BUILD_TAG}"
            sh "docker run -d --name hub${env.BUILD_TAG} \
                --network='${env.BUILD_TAG}' \
                -p 4444 selenium/hub"
            sh "docker run -d --name chrome${env.BUILD_TAG} \
                --network='${env.BUILD_TAG}' \
                -e HUB_PORT_4444_TCP_ADDR=hub${env.BUILD_TAG} \
                -e HUB_PORT_4444_TCP_PORT=4444 \
                selenium/node-chrome"
            sh "docker run -d --name firefox${env.BUILD_TAG} \
                --network='${env.BUILD_TAG}' \
                -e HUB_PORT_4444_TCP_ADDR=hub${env.BUILD_TAG} \
                -e HUB_PORT_4444_TCP_PORT=4444 \
                selenium/node-firefox"
            sh "docker run --rm --name frontend${env.BUILD_TAG} \
                --network='${env.BUILD_TAG}' \
                -e SELENIUM_HUB_HOST=hub${env.BUILD_TAG} \
                -e SERVER_HOST=frontend${env.BUILD_TAG} \
                optick/vueform npm run e2e --silent"
          }
        )
      }
    }
    stage('Deploy') {
      steps {
        echo 'deploying'
      }
    }
  }
  post {
    always {
      sh 'docker network rm selenium'
      sh "docker kill hub${env.BUILD_TAG} chrome${env.BUILD_TAG} firefox${env.BUILD_TAG}"
      sh "docker rm hub${env.BUILD_TAG} chrome${env.BUILD_TAG} firefox${env.BUILD_TAG}"
      sh "docker network rm ${env.BUILD_TAG}"
    }
  }
}
