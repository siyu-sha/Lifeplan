#!/usr/bin/env groovy
pipeline{
    agent { docker { image 'tiangolo/docker-with-compose' }}
    stages{
        stage("Bring down old images"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml down"
		sh "pwd"
                sh "ls -lR"
                sh "docker-compose -f docker-compose-CI.yml build"
                sh "docker-compose -f docker-compose-CI.yml up"
            }
        }
    }
}
