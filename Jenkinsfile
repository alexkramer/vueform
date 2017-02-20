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
          "End-to-End": {
            sh 'docker network create ${BUILD_TAG}'
            sh 'docker run -d --name hub$BUILD_TAG \
                --network="${BUILD_TAG}" \
                -p 4444 selenium/hub'
            sh 'docker run -d --name chrome${BUILD_TAG} \
                --network="${BUILD_TAG}" \
                -e HUB_PORT_4444_TCP_ADDR=hub${BUILD_TAG} \
                -e HUB_PORT_4444_TCP_PORT=4444 \
                selenium/node-chrome'
            sh 'docker run -d --name firefox${BUILD_TAG} \
                --network="${BUILD_TAG}" \
                -e HUB_PORT_4444_TCP_ADDR=hub${BUILD_TAG} \
                -e HUB_PORT_4444_TCP_PORT=4444 \
                selenium/node-firefox'
            sh 'docker run --rm --name frontend${BUILD_TAG} \
                --network="${BUILD_TAG}" \
                -e SELENIUM_HUB_HOST=hub${BUILD_TAG} \
                -e SERVER_HOST=frontend${BUILD_TAG} \
                optick/vueform npm run e2e --silent'
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
      sh 'docker kill hub${BUILD_TAG} chrome${BUILD_TAG} firefox${BUILD_TAG}'
      sh 'docker rm hub${BUILD_TAG} chrome${BUILD_TAG} firefox${BUILD_TAG}'
      sh 'docker network rm ${BUILD_TAG}'
    }
  }
}
