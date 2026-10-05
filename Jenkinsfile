pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  triggers {
    pollSCM('H/2 * * * *')   // checks GitHub every ~2 min (remove if using a webhook)
  }

  environment {
    DEPLOY_DIR = 'C:\\jenkins-deploy\\site'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Validate') {
      steps {
        bat '''
        if not exist index.html (
          echo ERROR: index.html not found
          exit /b 1
        )
        echo index.html found
        '''
      }
    }

    stage('Deploy') {
      steps {
        bat '''
        robocopy . "%DEPLOY_DIR%" /MIR /XD .git /XF Jenkinsfile
        if %ERRORLEVEL% GEQ 8 exit /b 1
        exit /b 0
        '''
      }
    }
  }

  post {
    success { echo "Deployed to ${env.DEPLOY_DIR}" }
    failure { echo 'Build failed, check the stage logs above' }
  }
}
