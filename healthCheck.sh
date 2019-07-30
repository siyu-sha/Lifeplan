# Get ports from .env
export $(egrep -v '^#' .env | xargs)
echo "django-port: $DOCKER_DJANGO_PORT"
echo "react-port: $DOCKER_REACT_PORT"

# Wait for django to start
timeout -t 120 /bin/bash -c 'until curl --output /dev/null --silent "http://localhost:${DOCKER_DJANGO_PORT}/"; do sleep 2; done'

# ping django with HTTP GET
status_code=$(curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:${DOCKER_DJANGO_PORT}/")
#host.docker.internal = localhost of docker host
if [ "$status_code" -ne 200 ]
then
    echo "Django Health check returned HTTP Response other than 200"
    echo `curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:${DOCKER_DJANGO_PORT}/"`
    echo `curl  "http://localhost:${DOCKER_DJANGO_PORT}/"`
    exit 1
else
    echo "Django Health Check returned HTTP Response 200"
fi

# Wait for react to start
timeout -t 120 /bin/bash -c 'until curl --output /dev/null --silent "http://localhost:${DOCKER_REACT_PORT}/"; do sleep 2; done'

# ping react with HTTP GET
status_code_2=$(curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:${DOCKER_REACT_PORT}/")
if [ "$status_code_2" -ne 200 ]
then
    echo "React Health check returned HTTP Response other than 200"
    echo `curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:${DOCKER_REACT_PORT}/"`
    echo `curl  "http://localhost:${DOCKER_REACT_PORT}/"`
    exit 1
else
    echo "React Health Check returned HTTP Response 200"
fi
