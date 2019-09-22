# Generate random ports for Django and React
# Django ports are gone. Further refactoring will see docker-compose split into a base file and override set.
# Not run until AWS deployment is organised, and a port decided
export DEPLOYMENT_ENV="PROD"
echo "environment: $DEPLOYMENT_ENV"
export NODE_ENV="production"
echo "NODE_ENV:" $NODE_ENV
export DJANGO_PORT=8000
export REACT_PORT=80
echo "react-port: $REACT_PORT"

# Put the port settings in an .env file for Docker
echo -e "DOCKER_DJANGO_PORT=$DJANGO_PORT\nDOCKER_REACT_PORT=$REACT_PORT\nNODE_ENV=$NODE_ENV" > ".env"
