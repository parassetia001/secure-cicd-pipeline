pipeline {
    agent any
    environment {
        GIT_CREDENTIALS = 'github-credentials'  // Use the ID of your stored credentials
        IMAGE_NAME = "myapp:latest"
        CONTAINER_NAME = "myapp_container"
        APP_PORT = "3000"
        SONARQUBE_URL = 'http://34.42.40.184:9000'  // Replace with your SonarQube URL
    }
    stages {
        //Uncomment and configure if you want to clone from GitHub
        // stage('Clone Repository') {
        //     steps {
        //         git credentialsId: "${GIT_CREDENTIALS}", url: 'https://github.com/parassetia001/secure-cicd-pipeline.git', branch: 'main'
        //     }
        // }

        // SonarQube Analysis: Scan the code for quality analysis
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') { // Use your SonarQube configuration name here
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONARQUBE_TOKEN')]) {
                        sh "npm install" // Install Node.js dependencies
                        sh """
                            /opt/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=my-nodejs-app -Dsonar.sources=. -Dsonar.host.url=$SONARQUBE_URL -Dsonar.login=$SONARQUBE_TOKEN
                        """
                    }
                }
            }
        }

        // Quality Gate Check: Check if code passes SonarQube quality gate before proceeding
        stage('Quality Gate Check') {
            steps {
                script {
                    // Wait for the quality gate status before proceeding
                    timeout(time: 1, unit: 'MINUTES') {
                        def qualityGate = waitForQualityGate()
                        if (qualityGate.status != 'OK') {
                            error("❌ Quality Gate failed! Status: ${qualityGate.status}")
                        }
                    }
                }
            }
        }
        
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
