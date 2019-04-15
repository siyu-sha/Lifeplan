#!/usr/bin/env groovy
pipeline{
    agent { docker { image 'tiangolo/docker-with-compose' }}
    stages{
        stage("Bring down old images"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml down"
            }
        }
        stage("Verify Directory"){
            steps{
                sh "pwd"
                sh "ls -lR"
                } 
            }
        stage("Build"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml build"
            }
        }
        stage("Run"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml up"
            }
        }
    }
}
