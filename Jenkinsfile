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
            sh 'kubectl run vueform${BUILD_TAG} -i --rm --generator=run-pod/v1 \
                --env="SELENIUM_HUB_HOST=selenium-hub" \
                --env="SERVER_HOST=vueform${BUILD_TAG}" \
                --image=optick/vueform \
                --command -- npm run e2e --silent'
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
}
