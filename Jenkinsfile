#!/usr/bin/env groovy
pipeline{
    agent {
        dockerfile {
            filename 'Dockerfile'
            args '--network="host"'
        }
    }
    stages{
        stage("Bring Down Old Images"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml down"
            }
        }
        stage("Build and Run New Images"){
            steps{
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
            sh "docker-compose -f docker-compose-CI.yml down"
        }
    }
}
