# Generate random ports for Django and React
export DEPLOYMENT_ENV="DEV"
echo "environment: $DEPLOYMENT_ENV"
export DJANGO_PORT=8000
echo "django-port: $DJANGO_PORT"
export REACT_PORT=3000
echo "react-port: $REACT_PORT"

# Put the port settings in an .env file for Docker
echo -e "DOCKER_DJANGO_PORT=$DJANGO_PORT\nDOCKER_REACT_PORT=$REACT_PORT" > ".env"
