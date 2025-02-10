pipeline {
    agent any
    environment {
        GIT_CREDENTIALS = 'github-credentials'  // Use the ID of your stored credentials
		IMAGE_NAME = "myapp:latest"
        CONTAINER_NAME = "myapp_container"
        APP_PORT = "3000"
    }
    stages {
//        stage('Clone Repository') {
//            steps {
//                git credentialsId: "${GIT_CREDENTIALS}", url: 'https://github.com/your-username/secure-cicd-pipeline.git'
//            }
//        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                script {
                    def running = sh(script: "docker ps -q -f name=$CONTAINER_NAME", returnStdout: true).trim()
                    if (running) {
                        sh "docker stop $CONTAINER_NAME"
                        sh "docker rm $CONTAINER_NAME"
                    }
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p $APP_PORT:3000 --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }
        stage('Verify Application') {
            steps {
                script {
                    sleep 5 // Wait for the app to start
                    sh 'curl -f http://localhost:$APP_PORT || exit 1'
                }
            }
        }		
    }
    post {
        success {
            echo "Deployment successful! App running at http://localhost:$APP_PORT"
        }
        failure {
            echo "Deployment failed!"
        }
    }	
}
