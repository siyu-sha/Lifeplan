# Get ports from .env
export $(egrep -v '^#' .env | xargs)
echo "django-port: $DOCKER_DJANGO_PORT"
echo "react-port: $DOCKER_REACT_PORT"

#Sleep for 70s for django to start
sleep 70

# ping django with HTTP GET
status_code=$(curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:$DOCKER_DJANGO_PORT/")
#host.docker.internal = localhost of docker host
if [ "$status_code" -ne 200 ]
then
    echo "Django Health check returned HTTP Response other than 200"
    echo `curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:$DOCKER_DJANGO_PORT/"`
    echo `curl  "localhost:$DOCKER_DJANGO_PORT/"`
    exit 1
else
    echo "Django Health check returned HTTP Response 200"
fi
# ping react with HTTP GET
status_code_2=$(curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:$DOCKER_REACT_PORT/")
if [ "$status_code_2" -ne 200 ]
then
    echo "React Health check returned HTTP Response other than 200"
    echo `curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:$DOCKER_REACT_PORT/"`
    echo `curl  "http://localhost:$DOCKER_REACT_PORT/"`
    exit 1
else
    echo "React Health check returned HTTP Response 200"
fi

