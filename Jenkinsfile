#!/usr/bin/env groovy
pipeline{
    agent {
        dockerfile {
            filename 'Dockerfile'
            args '--network="host"'
        }
    }
    stages{
        stage("Setup Env Vars, Build and Run New Images"){
            steps{
                sh "./setup-env.sh"
                sh "export DJANGO_PORT=\$((($RANDOM % 999) + 8000))"
                sh "export REACT_PORT=\$((($RANDOM % 999) + 3000))"
                sh "docker-compose -f docker-compose-CI.yml build"
                sh "docker-compose -f docker-compose-CI.yml up -d"
            }
        }
        stage("Run Health Check Script"){
            steps{
                sh "./healthCheck.sh"
                sh "sleep 10"
            }
        }
    }
    post{
        always{
            sh "docker-compose -f docker-compose-CI.yml down"
        }
    }
}
