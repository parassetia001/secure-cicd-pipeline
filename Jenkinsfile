pipeline {
    agent any
    environment {
        GIT_CREDENTIALS = 'github-credentials'  // Use the ID of your stored credentials
    }
    stages {
//        stage('Clone Repository') {
//            steps {
//                git credentialsId: "${GIT_CREDENTIALS}", url: 'https://github.com/your-username/secure-cicd-pipeline.git'
//            }
//        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp:latest .'
            }
        }

        stage('Run Container') {
            steps {
                // Run the container, mapping port 3000 inside the container to port 8081 on the host machine
                sh 'docker run -d -p 8081:3000 myapp:latest'
            }
        }
    }
}
