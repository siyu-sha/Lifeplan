# Generate random ports for Django and React
#Django ports are gone. Further refactoring will see docker-compose split into a base file and override set
export REACT_PORT=80
echo "react-port: $REACT_PORT"

# Put the port settings in an .env file for Docker
echo -e "DOCKER_DJANGO_PORT=$DJANGO_PORT\nDOCKER_REACT_PORT=$REACT_PORT" > ".env"
