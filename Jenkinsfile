#!/usr/bin/env groovy
pipeline{
    agent { docker{image "tmaier/docker-compose:latest" } }
    stages{
        stage("Build and Run"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml down"
		sh "docker-compose -version"
		sh "pwd"
                sh "ls -lR"
                sh "docker-compose -f docker-compose-CI.yml build"
                sh "docker-compose -f docker-compose-CI.yml up -d"
            }
        }
    }
}
