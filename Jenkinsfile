pipeline {
    agent any

    tools {nodejs 'node'}

    stages {
        stage('Checkout') {
            steps {
                // Perform checkout
                def scmInfo = checkout scm

                // Log SCM information
                echo "SCM Information:"
                echo "Repository URL: ${scmInfo.GIT_URL}"
                echo "Branch: ${scmInfo.GIT_BRANCH}"
                echo "Commit: ${scmInfo.GIT_COMMIT}"

                checkout scm
            }
        }
        stage('Install Dependencies') {
            sh 'npm install'
        }

        stage('Run test') {
            echo 'Skip test'
        }

        stage('Build serivce') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Packaging/Pushing imagae') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDENTIALS_ID]]) {
                        sh 'aws ecr-public get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin public.ecr.aws/microdevhub-test'
                    }
                    
                    // Build and push Docker image
                    def image = docker.build("public.ecr.aws/h7q5l7b8/microdevhub-test:${env.BUILD_ID}")
                    docker.withRegistry("https://public.ecr.aws/microdevhub-test", '') {
                        image.push()
                    }
                }
            }
        }
    }
}