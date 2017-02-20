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
            sh 'kubectl create -f test/e2e/kube-config/vueform.yml'
            sh 'kubectl attach -i vueform'
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
      junit 'e2e-reports/**/*.xml'
    }
  }
}
