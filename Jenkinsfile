#!/usr/bin/env groovy
pipeline{
    agent { docker{image "tmaier/docker-compose:latest" } }
    stages{
        stage("Bring down old images"){
            steps{
                sh "docker-compose -f docker-compose-CI.yml down"
		sh "pwd"
                sh "ls -lR"
                sh "docker-compose --verbose -f docker-compose-CI.yml build"
                sh "docker-compose --verbose -f docker-compose-CI.yml up"
            }
        }
    }
}
