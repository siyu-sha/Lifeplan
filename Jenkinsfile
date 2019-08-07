#! /usr/bin/env groovy
pipeline{
    agent {
        dockerfile {
            filename 'Dockerfile'
            args '--network="host"'
        }
    }
    stages{
        stage("Parallel Tests"){
            parallel{
                stage("Frontend Tests"){
                    agent{
                        dockerfile{
                            dir 'frontend'
                            filename 'Dockerfile'
                            args '-e CI=true'
                        }
                    }
                    steps {
                        sh "npm list -g"
                        sh "npm --prefix frontend/ test --exit"
                    }
                }
                stage("Backend Tests"){
                    agent{
                        dockerfile{
                            filename 'Dockerfile'
                        }
                    }
                    steps {
                        sh "./setup-env.sh"
                        sh "docker-compose -f docker-compose-CI.test.yml build"
                        sh "docker-compose -f docker-compose-CI.test.yml up --abort-on-container-exit"
                    }
                    post{
                        always{
                            sh "docker-compose -f docker-compose-CI.test.yml down -v"
                        }
                    }
                }
            }
        }
        stage("Setup Env Vars, Build and Run New Images"){
            when {
                not {
                    branch 'develop'
                }
            }
            steps{
                sh "./setup-env.sh"
                sh "docker-compose -f docker-compose-CI.yml build"
                sh "docker-compose -f docker-compose-CI.yml up -d"
            }
        }
        stage("Deploy to Dev Environment"){
            when{
                branch 'develop'
            }
            steps{
                sh "./setup-env.dev.sh"
                sh "docker-compose -f docker-compose-prod.yml down"
                sh "docker-compose -f docker-compose-prod.yml build"
                sh "docker-compose -f docker-compose-prod.yml up -d"
            }
        }
        stage("Run Health Check Script"){
            steps{
                sh "./healthCheck.sh"
            }
        }
    }
    post{
        always{
            script{
                if (env.BRANCH_NAME != 'develop') {
                    sh "docker-compose -f docker-compose-CI.yml down -v"
                }
                
            }
        }
    }
}
