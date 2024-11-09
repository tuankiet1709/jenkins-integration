pipeline {
    agent any
    environment {
        AWS_CREDENTIALS_ID = 'microdevhub_aws'
        ECR_REPO_URI = 'public.ecr.aws/h7q5l7b8/microdevhub-test'
        IMAGE_TAG = "${env.GIT_COMMIT}"
        NVM_DIR = '/var/lib/jenkins/.nvm'
    }
    stages {
        stage('configuration') {
            steps {
                echo 'BRANCH NAME: ' + env.BRANCH_NAME
                echo sh(returnStdout: true, script: 'env')
            }
        }

        stage('checkout') {
            steps {
                checkout scm
            }
        }
        
        stage("build"){
            steps {
                sh 'echo "Build Started"'
                sh 'npm install' 
            }
        }

        stage('Tag Commit') {
            when {
                branch 'main' // Only tag if on the main branch
            }
            steps {
                script {
                    // Get the short commit hash for tagging
                    env.GIT_COMMIT_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()

                    // Configure Git to use the token for authentication
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        sh """
                        git config --global user.name "jenkins-bot"
                        git config --global user.email "jenkins-bot@users.noreply.github.com"
                        git tag -a v-${GIT_COMMIT_TAG} -m 'Tagging commit with v-${GIT_COMMIT_TAG}'
                        git push https://github.com/tuankiet1709/jenkins-integration.git --tags
                        """
                    }
                }
            }
        }

        stage("Docker Build") {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Use the Git tag as the Docker image tag
                    docker.build("${ECR_REPO_URI}:${GIT_COMMIT_TAG}")
                }
            }
        }

        stage('Login to ECR') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: AWS_CREDENTIALS_ID]]) {
                        // Authenticate Docker with ECR
                        sh '''
                        aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin ${ECR_REPO_URI}
                        '''
                    }
                }
            }
        }

        stage("Push to ECR") {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Push the Docker image with the commit tag to ECR
                    docker.image("${ECR_REPO_URI}:${GIT_COMMIT_TAG}").push()
                }
            }
        }

        stage("Deploy") {
            when {
                branch 'main'
            }
            steps {
                sh 'echo "Deploying App"'
                // Add any deployment-specific commands here
            }
        }
    }
    
    post{
        success{
            setBuildStatus("Build succeeded", "SUCCESS");
        }

        failure {
            setBuildStatus("Build failed", "FAILURE");
        } 
    }
}

void setBuildStatus(String message, String state) {
    step([
        $class: "GitHubCommitStatusSetter",
        reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/tuankiet1709/jenkins-integration.git"],
        contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
        errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
        statusResultSource: [$class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]]]
    ]);
}