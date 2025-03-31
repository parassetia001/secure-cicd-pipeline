pipeline {
    agent none
    environment {
        GIT_CREDENTIALS = 'github-credentials'
        IMAGE_NAME = "myapp:${BUILD_ID}"
        CONTAINER_NAME = "myapp_container"
        APP_PORT = "3000"
        SONARQUBE_URL = 'http://34.42.40.184:9000'
        DEPLOYMENT_URL = "http://54.86.217.254:${APP_PORT}"
    }
    stages {
        /* STAGE 1: Code Checkout * Uncomment and configure if you want to clone from GitHub/
        // stage('Code Checkout') {
        //     agent { label 'built-in' }
        //     steps {
        //         cleanWs()
        //         checkout([
        //             $class: 'GitSCM',
        //             branches: [[name: '*/main']],
        //             extensions: [],
        //             userRemoteConfigs: [[
        //                 credentialsId: "${GIT_CREDENTIALS}",
        //                 url: 'https://github.com/parassetia001/secure-cicd-pipeline.git'
        //             ]]
        //         ])
        //     }
        // }

        /* STAGE 2: SonarQube Analysis */
        stage('SonarQube Analysis') {
            agent { label 'built-in' }
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONARQUBE_TOKEN')]) {
                        sh """
                            npm install
                            /opt/sonar-scanner/bin/sonar-scanner \
                                -Dsonar.projectKey=my-nodejs-app \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=$SONARQUBE_URL \
                                -Dsonar.login=$SONARQUBE_TOKEN
                        """
                    }
                }
            }
        }

        /* STAGE 3: Quality Gate */
        stage('Quality Gate') {
            agent { label 'built-in' }
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        /* STAGE 4: Build & Deploy (Ubuntu Node) */
        stage('Build & Deploy') {
            agent { label 'ubuntu-deployer' }
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: "${GIT_CREDENTIALS}",
                        url: 'https://github.com/parassetia001/secure-cicd-pipeline.git'
                    ]]
                ])
                
                sh """
                    # Build and deploy
                    docker build -t $IMAGE_NAME .
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                    docker run -d \
                        -p $APP_PORT:3000 \
                        --name $CONTAINER_NAME \
                        --restart unless-stopped \
                        $IMAGE_NAME
                """
            }
        }

        /* STAGE 5: Verification */
        stage('Verify Deployment') {
            agent { label 'ubuntu-deployer' }
            steps {
                retry(3) {
                    timeout(time: 1, unit: 'MINUTES') {
                        sh """
                            curl -sSf http://localhost:$APP_PORT || exit 1
                            echo "✅ Verification passed - app is responding"
                        """
                    }
                }
            }
        }
    }
    post {
        success {
            echo "Deployment successful! App running at $DEPLOYMENT_URL"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}