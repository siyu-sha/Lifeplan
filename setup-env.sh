# Generate random ports for Django and React
export DJANGO_PORT=$((($RANDOM % 999) + 8000))
echo "react-port: $REACT_PORT"
export REACT_PORT=$((($RANDOM % 999) + 3000))
echo "django-port: $DJANGO_PORT"

# Put the port settings in an .env file for Docker
echo -e "DOCKER_DJANGO_PORT=$DJANGO_PORT\nDOCKER_REACT_PORT=$REACT_PORT" > ".env"
