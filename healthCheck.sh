#Wait for django to start
timeout -t 60 bash -c 'until echo > /dev/tcp/localhost/8002; do sleep 2; done'

# ping django with HTTP GET
status_code=$(curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:8002/")
#host.docker.internal = localhost of docker host
if [ "$status_code" -ne 200 ]
then
    echo "Django Health Check returned HTTP Response other than 200"
    echo `curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:8002/"`
    echo `curl  "localhost:8002/"`
    exit 1
else
    echo "Django Health Check returned HTTP Response 200"
fi

#Wait for react to start
timeout -t 60 bash -c 'until echo > /dev/tcp/localhost/3002; do sleep 2; done'

# ping react with HTTP GET
status_code_2=$(curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:3002/")
if [ "$status_code_2" -ne 200 ]
then
    echo "React Health Check returned HTTP Response other than 200"
    echo `curl --write-out "%{http_code}\n" --silent --output /dev/null "http://localhost:3002/"`
    echo `curl  "http://localhost:3002/"`
    exit 1
else
    echo "React Health Check returned HTTP Response 200"
fi
