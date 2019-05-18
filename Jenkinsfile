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
                        docker{
                            image 'node'
                            args '-e CI=true'
                        }
                    }
                    steps {
                        sh "npm --prefix frontend/ install"
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
                }
            }
        }
        stage("Setup Env Vars, Build and Run New Images"){
            steps{
                sh "./setup-env.sh"
                sh "docker-compose -f docker-compose-CI.yml build"
                sh "docker-compose -f docker-compose-CI.yml up -d"
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
            sh "docker-compose -f docker-compose-CI.test.yml down -v"
            sh "docker-compose -f docker-compose-CI.yml down -v"
        }
    }
}
