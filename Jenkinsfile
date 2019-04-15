#!/usr/bin/env groovy
pipeline{
    agent { master }
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
                sh "docker-compose up"
            }
        }
    }
}
