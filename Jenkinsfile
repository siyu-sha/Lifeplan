#!/usr/bin/env groovy
pipeline{
    agent { docker { image 'tiangolo/docker-with-compose' }}
    stages{
        stage("Bring down old images"){
            steps{
                sh "docker-compose down"
            }
        }
        stage("Verify Directory"){
            steps{
                sh "ls -lR"
                } 
            }
        stage("Build"){
            steps{
                sh "docker-compose build"
            }
        }
        stage("Run"){
            steps{
                sh "docker-compose up"
            }
        }
    }
}
