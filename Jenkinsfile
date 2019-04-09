pipeline{
    agent { docker { image 'tiangolo/docker-with-compose' } }
    stages{
        stage("Build"){
            steps{
                sh "docker-compose build"
                sh "docker-compose up -d"
                waitUntilServicesReady
            }
        }
    }
}
