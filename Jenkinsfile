#! /usr/bin/env groovy
pipeline{
    agent {
        dockerfile {
            filename 'Dockerfile'
            args '--network="host"'
        }
    }
    stages{
    	stage("Frontend Tests"){
            agent{
                    dockerfile{
                        filename 'Dockerfile-CI.test'
                        dir 'frontend'
                    }
                }
    		steps {
                sh "ls -laRt"
    		
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
            sh "docker-compose -f docker-compose-CI.yml down"
        }
    }
}
