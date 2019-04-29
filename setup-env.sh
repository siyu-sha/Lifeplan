#!/bin/bash
export DJANGO_PORT=$((($RANDOM % 999) + 8000))
echo "django-port: $DJANGO_PORT"
export REACT_PORT=$((($RANDOM % 999) + 3000))
echo "react-port: $REACT_PORT"
